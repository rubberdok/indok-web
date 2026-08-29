import re
from collections.abc import Iterable

from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import get_template
from django.utils.html import strip_tags

from apps.janhus.models import JanHusBooking
from apps.janhus.rules import get_or_create_settings
from utils.mail.streams import TransactionalEmail

CONFIRMATION_TEMPLATE = "janhus_confirmation_template.html"
REQUEST_RECEIVED_TEMPLATE = "janhus_request_received_template.html"
ADMIN_REQUEST_TEMPLATE = "janhus_admin_request_template.html"
REJECTED_TEMPLATE = "janhus_rejected_template.html"
CONFIRMATION_STREAM = "janhus-booking-confirmations"

EVENT_TYPE_LABELS = {
    "INTERNAL": "Intern",
    "OPEN_FOR_INDOK": "Åpent for Indøk-studenter",
    "PRIVATE": "Privat",
    "EXTERNAL": "Eksternt",
}


def send_pending_review_notification(bookings: Iterable[JanHusBooking]) -> None:
    recipients_by_key: dict[str, str] = {}
    for booking in bookings:
        for email in [booking.responsible_email, booking.booker_email]:
            clean_email = (email or "").strip()
            if clean_email:
                recipients_by_key[clean_email.lower()] = clean_email

    recipients = list(recipients_by_key.values())

    if not recipients:
        return

    send_mail(
        subject="JanHus booking set to pending admin review",
        message=(
            "A booking in your selected timeframe has been moved to pending admin review. "
            "A JanHus booking admin will follow up shortly."
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=list(recipients),
        fail_silently=True,
    )


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


def _send(*, template: str, subject: str, recipients: list, content: dict) -> None:
    """
    Render an HTML template and send it as a transactional mail with a plain-text
    alternative. Recipients go in bcc so they never see each other's address.
    """
    if not recipients:
        return

    html_content = get_template(template).render(content)

    email = TransactionalEmail(
        stream=CONFIRMATION_STREAM,
        subject=subject,
        body=_html_to_plain_text(html_content),
        bcc=recipients,
    )
    email.attach_alternative(html_content, "text/html")
    email.send(fail_silently=True)


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
        "starts_at": booking_request.starts_at.strftime("%d.%m.%Y kl. %H:%M"),
        "ends_at": booking_request.ends_at.strftime("%d.%m.%Y kl. %H:%M"),
        "event_type": EVENT_TYPE_LABELS.get(
            booking_request.event_type, booking_request.event_type
        ),
        "responsible_name": booking_request.responsible_name,
        "responsible_email": booking_request.responsible_email,
        "responsible_phone": booking_request.responsible_phone,
        "comment": booking_request.comment,
        "contact_email": settings.CONTACT_EMAIL,
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
        subject=f"Vi har mottatt JanHus-søknaden din ({content['area_name']})",
        recipients=_request_recipients(booking_request),
        content=content,
    )

    admin_email = (get_or_create_settings().booking_contact_email or "").strip()
    if not admin_email:
        return

    owner_organization = booking_request.owner_organization
    _send(
        template=ADMIN_REQUEST_TEMPLATE,
        subject=f"Ny JanHus-søknad: {content['area_name']} {content['starts_at']}",
        recipients=[admin_email],
        content={
            **content,
            "owner_label": (
                owner_organization.name if owner_organization else "Personlig"
            ),
            "admin_url": f"{settings.FRONTEND_BASE_URL}/janhus/admin",
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
        subject=f"JanHus-søknaden din ble dessverre ikke godkjent ({content['area_name']})",
        recipients=_request_recipients(booking_request),
        content={**content, "admin_comment": booking_request.admin_comment},
    )


def send_booking_declined(booking: JanHusBooking) -> None:
    """
    Sent when a booking that already existed is declined by an admin.
    """
    _send(
        template=REJECTED_TEMPLATE,
        subject=f"JanHus-bookingen din er avlyst ({booking.reference})",
        recipients=_booking_recipients(booking),
        content={
            "requester_name": (
                booking.booker_name or booking.responsible_name or ""
            ).strip(),
            "area_name": booking.area.name,
            "starts_at": booking.starts_at.strftime("%d.%m.%Y kl. %H:%M"),
            "ends_at": booking.ends_at.strftime("%d.%m.%Y kl. %H:%M"),
            "admin_comment": booking.admin_comment,
            "contact_email": settings.CONTACT_EMAIL,
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
        "starts_at": booking.starts_at.strftime("%d.%m.%Y kl. %H:%M"),
        "ends_at": booking.ends_at.strftime("%d.%m.%Y kl. %H:%M"),
        "event_type": EVENT_TYPE_LABELS.get(booking.event_type, booking.event_type),
        "responsible_name": booking.responsible_name,
        "responsible_email": booking.responsible_email,
        # Organization bookings are settled internally, so no price is quoted here.
        "show_price": booking.owner_organization_id is None,
        "total_price": booking.total_price,
        "deposit_amount": booking.outstanding_deposit_amount or None,
        "contact_email": settings.CONTACT_EMAIL,
        **_cleaning_context(cleaning_requested=booking.cleaning_requested),
    }

    html_content = get_template(CONFIRMATION_TEMPLATE).render(content)

    email = TransactionalEmail(
        stream=CONFIRMATION_STREAM,
        subject=f"JanHus-bookingen din er bekreftet ({booking.reference})",
        body=_html_to_plain_text(html_content),
        bcc=recipients,
    )
    email.attach_alternative(html_content, "text/html")

    # TODO: attach the JanHus documents once they exist, the way the cabins
    # approval mail does. Requires these files to be added to the repo first:
    #   static/janhus/Reglement.pdf      - house rules
    #   static/janhus/Sjekkliste.pdf     - cleaning/checkout checklist
    #   templates/janhus_contract_template.html - contract rendered per booking,
    #       replacing the acceptedContractPlaceholder step in the booking flow
    # email.attach_file("static/janhus/Reglement.pdf")
    # email.attach_file("static/janhus/Sjekkliste.pdf")
    # contract_pdf = html_to_pdf("janhus_contract_template.html", content)
    # email.attach("Kontrakt.pdf", contract_pdf, "application/pdf")

    email.send(fail_silently=True)
