import io
import logging
import re

from django.conf import settings
from django.template.loader import get_template, render_to_string
from django.utils.html import strip_tags
from weasyprint import HTML

from apps.janhus.models import JanHusBooking
from apps.janhus.rules import get_or_create_settings
from utils.mail.streams import TransactionalEmail

logger = logging.getLogger(__name__)

CONFIRMATION_TEMPLATE = "janhus_confirmation_template.html"
REQUEST_RECEIVED_TEMPLATE = "janhus_request_received_template.html"
ADMIN_REQUEST_TEMPLATE = "janhus_admin_request_template.html"
REJECTED_TEMPLATE = "janhus_rejected_template.html"
CONTRACT_TEMPLATE = "janhus_contract_template.html"
CONFIRMATION_STREAM = "janhus-booking-confirmations"
TIME_FORMAT_TEXT = "%d.%m.%Y kl. %H:%M"

SUBJECTS = {
    "reserve": "Bekreftelse på mottatt søknad om booking av ",
    "admin_reserve": "Booking av ",
    "decision": "Janus Eiendom har tatt stilling til søknaden din om booking av ",
}

EVENT_TYPE_LABELS = {
    "INTERNAL": "Intern",
    "OPEN_FOR_INDOK": "Åpent for Indøk-studenter",
    "PRIVATE": "Privat",
    "EXTERNAL": "Eksternt",
}


def _booking_recipients(booking: JanHusBooking) -> list[str]:
    """
    Booker and responsible person, de-duplicated case-insensitively so a booking
    where both are the same person only produces one recipient.
    """
    recipients_by_key: dict[str, str] = {}
    for email in [booking.booker_email, booking.responsible_email]:
        clean_email = (email or "").strip()
        if clean_email:
            recipients_by_key[clean_email.lower()] = clean_email

    return list(recipients_by_key.values())


def _html_to_plain_text(html: str) -> str:
    """
    strip_tags leaves the contents of <style> behind, so drop those blocks first;
    otherwise the plain-text part of the mail starts with CSS.
    """
    without_style = re.sub(
        r"<style.*?</style>", "", html, flags=re.DOTALL | re.IGNORECASE
    )
    with_breaks = re.sub(r"<br\s*/?>|</p>", "\n", without_style, flags=re.IGNORECASE)
    text = strip_tags(with_breaks)
    lines = [line.strip() for line in text.splitlines()]
    return "\n".join(line for line in lines if line)


def _signature_context() -> dict:
    """
    Sign-off details shared by every JanHus email through janhus_signature.html.
    Falls back to the site contact address when no JanHus contact is configured.
    """
    booking_settings = get_or_create_settings()
    return {
        "contact_name": booking_settings.booking_contact_name,
        "contact_email": (
            booking_settings.booking_contact_email or settings.CONTACT_EMAIL
        ),
        "contact_phone": booking_settings.booking_contact_phone,
    }


def html_to_pdf(template_src: str, context_dict={}):
    """
    Same helper as apps/cabins/mail.py, used to attach the contract as a PDF.
    """
    html_string = render_to_string(template_src, context_dict)
    html = HTML(string=html_string)
    buffer = io.BytesIO()
    html.write_pdf(target=buffer)
    return buffer.getvalue()


def _deliver(email) -> None:
    """
    Mail is a side effect of booking mutations that have already committed, so a
    delivery failure must not surface as a mutation error or roll anything back.
    It is logged instead of silently dropped, so Sentry still reports it.
    """
    try:
        email.send()
    except Exception:
        logger.exception("Could not send JanHus email: %s", email.subject)


def _send(*, template: str, subject: str, recipients: list, content: dict) -> None:
    """
    Render an HTML template and send it as a transactional mail with a plain-text
    alternative. Recipients go in bcc so they never see each other's address.
    """
    if not recipients:
        return

    html_content = get_template(template).render({**_signature_context(), **content})

    email = TransactionalEmail(
        stream=CONFIRMATION_STREAM,
        subject=subject,
        body=_html_to_plain_text(html_content),
        bcc=recipients,
    )
    email.attach_alternative(html_content, "text/html")
    _deliver(email)


def _cleaning_context(*, cleaning_requested: bool) -> dict:
    """
    Cleaning is only mentioned when JanHus offers it. A booking that already
    requested cleaning still shows it, so a service the booker is paying for is
    never hidden if an admin turns the option off afterwards.
    """
    show_cleaning = (
        get_or_create_settings().cleaning_option_enabled or cleaning_requested
    )
    return {
        "show_cleaning": show_cleaning,
        "cleaning_requested": "Ja" if cleaning_requested else "Nei",
    }


def _request_recipients(booking_request) -> list:
    recipients_by_key: dict[str, str] = {}
    for email in [booking_request.requester_email, booking_request.responsible_email]:
        clean_email = (email or "").strip()
        if clean_email:
            recipients_by_key[clean_email.lower()] = clean_email

    return list(recipients_by_key.values())


def _request_content(booking_request) -> dict:
    return {
        "requester_name": (
            booking_request.requester_name or booking_request.responsible_name or ""
        ).strip(),
        "requester_email": booking_request.requester_email or "-",
        "requester_phone": booking_request.requester_phone or "-",
        "area_name": booking_request.area.name,
        "starts_at": booking_request.starts_at.strftime(TIME_FORMAT_TEXT),
        "ends_at": booking_request.ends_at.strftime(TIME_FORMAT_TEXT),
        "event_type": EVENT_TYPE_LABELS.get(
            booking_request.event_type, booking_request.event_type
        ),
        "responsible_name": booking_request.responsible_name,
        "responsible_email": booking_request.responsible_email,
        "responsible_phone": booking_request.responsible_phone,
        "comment": booking_request.comment,
        **_cleaning_context(cleaning_requested=booking_request.cleaning_requested),
    }


def send_booking_request_received(booking_request) -> None:
    """
    Receipt to the person who submitted a booking request, plus a notification to
    the JanHus board. Mirrors the cabins "reserve_booking" step.
    """
    content = _request_content(booking_request)

    _send(
        template=REQUEST_RECEIVED_TEMPLATE,
        subject=SUBJECTS["reserve"] + content["area_name"],
        recipients=_request_recipients(booking_request),
        content=content,
    )

    admin_email = (get_or_create_settings().booking_contact_email or "").strip()
    if not admin_email:
        return

    owner_organization = booking_request.owner_organization
    _send(
        template=ADMIN_REQUEST_TEMPLATE,
        subject=SUBJECTS["admin_reserve"] + content["area_name"],
        recipients=[admin_email],
        content={
            **content,
            "owner_label": (
                owner_organization.name if owner_organization else "Personlig"
            ),
        },
    )


def send_booking_request_rejected(booking_request) -> None:
    """
    Sent when the JanHus board rejects a request. Mirrors the cabins
    "disapprove_booking" step.
    """
    content = _request_content(booking_request)

    _send(
        template=REJECTED_TEMPLATE,
        subject=SUBJECTS["decision"] + content["area_name"],
        recipients=_request_recipients(booking_request),
        content={**content, "admin_comment": booking_request.admin_comment},
    )


def send_booking_declined(booking: JanHusBooking) -> None:
    """
    Sent when a booking that already existed is declined by an admin.
    """
    _send(
        template=REJECTED_TEMPLATE,
        subject=SUBJECTS["decision"] + booking.area.name,
        recipients=_booking_recipients(booking),
        content={
            "requester_name": (
                booking.booker_name or booking.responsible_name or ""
            ).strip(),
            "area_name": booking.area.name,
            "starts_at": booking.starts_at.strftime(TIME_FORMAT_TEXT),
            "ends_at": booking.ends_at.strftime(TIME_FORMAT_TEXT),
            "admin_comment": booking.admin_comment,
        },
    )


def send_booking_confirmation(booking: JanHusBooking) -> None:
    """
    Sent once a booking reaches CONFIRMED, carrying the booking reference the
    booker should quote in any later correspondence.
    """
    recipients = _booking_recipients(booking)
    if not recipients:
        return

    content = {
        "booker_name": (booking.booker_name or booking.responsible_name or "").strip(),
        "reference": booking.reference,
        "area_name": booking.area.name,
        "starts_at": booking.starts_at.strftime(TIME_FORMAT_TEXT),
        "ends_at": booking.ends_at.strftime(TIME_FORMAT_TEXT),
        "event_type": EVENT_TYPE_LABELS.get(booking.event_type, booking.event_type),
        "responsible_name": booking.responsible_name,
        "responsible_email": booking.responsible_email,
        # Organization bookings are settled internally, so no price is quoted here.
        "show_price": booking.owner_organization_id is None,
        "total_price": booking.total_price,
        "deposit_amount": booking.outstanding_deposit_amount or None,
        **_cleaning_context(cleaning_requested=booking.cleaning_requested),
    }

    html_content = get_template(CONFIRMATION_TEMPLATE).render(
        {**_signature_context(), **content}
    )

    email = TransactionalEmail(
        stream=CONFIRMATION_STREAM,
        subject=SUBJECTS["decision"] + booking.area.name,
        body=_html_to_plain_text(html_content),
        bcc=recipients,
    )
    email.attach_alternative(html_content, "text/html")

    contract_pdf = html_to_pdf(CONTRACT_TEMPLATE, content)
    email.attach("Kontrakt.pdf", contract_pdf, "application/pdf")

    # TODO: attach the remaining JanHus documents once they exist, the way the
    # cabins approval mail does. Both files still need adding to the repo:
    #   static/janhus/Reglement.pdf   - house rules
    #   static/janhus/Sjekkliste.pdf  - cleaning/checkout checklist
    # email.attach_file("static/janhus/Reglement.pdf")
    # email.attach_file("static/janhus/Sjekkliste.pdf")

    _deliver(email)
