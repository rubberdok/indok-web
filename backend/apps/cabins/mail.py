from typing import Optional

from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template, render_to_string
from django.utils.html import strip_tags

from apps.cabins.models import BookingResponsible
from apps.cabins.types import BookingInfoType, AdminTemplateType, UserTemplateType, EmailTypes

from weasyprint import HTML
import io

user_templates: UserTemplateType = {
    "reserve_subject": "Bekreftelse på mottat søknad om booking av ",
    "decision_subject": "Hyttestyret har tatt stilling til søknaden din om booking av ",
    "reserve_booking": "user_reserve_template.html",
    "approve_booking": "user_approved_template.html",
    "disapprove_booking": "user_disapproved_template.html",
}

admin_templates: AdminTemplateType = {
    "reserve_subject": "Booking av ",
    "reserve_booking": "admin_reserve_template.html",
}


def get_email_subject(chosen_cabins_string: str, email_type: str, admin: bool) -> str:
    if admin:
        subject = admin_templates["reserve_subject"]
    else:
        subject = (
            user_templates["reserve_subject"] if email_type == "reserve_booking" else user_templates["decision_subject"]
        )

    return subject + chosen_cabins_string


def send_mail(booking_info: BookingInfoType, email_type: EmailTypes, admin: bool) -> None:
    if admin:
        template = admin_templates["reserve_booking"]
    else:
        template = user_templates[email_type]

    chosen_cabins_names = booking_info["cabins"].values_list("name", flat=True)
    chosen_cabins_string = " og ".join(chosen_cabins_names)
    subject = get_email_subject(chosen_cabins_string, email_type, admin)
    booking_responsible: Optional[BookingResponsible] = BookingResponsible.objects.filter(active=True).first()

    # Display dates with given format in the mail, get booking responsible contact info
    content = {
        **booking_info,
        "check_in": booking_info["check_in"].strftime("%d-%m-%Y"),
        "check_out": booking_info["check_out"].strftime("%d-%m-%Y"),
        "chosen_cabins_string": chosen_cabins_string,
        "booking_responsible_name": f"{booking_responsible.first_name} {booking_responsible.last_name}",
        "booking_responsible_phone": booking_responsible.phone,
        "booking_responsible_email": booking_responsible.email,
    }

    # HTML content for mail services supporting HTML, text content if HTML isn't supported
    html_content = get_template(template).render(content)
    text_content = strip_tags(html_content)

    email = EmailMultiAlternatives(
        subject,
        body=text_content,
        from_email="noreply@indokntnu.no",
        bcc=[booking_responsible.email if admin else booking_info["receiver_email"]],
    )
    email.attach_alternative(html_content, "text/html")

    # Don't send attachments to admin nor when a booking is disapproved
    if email_type != "disapprove_booking" and not admin:
        email.attach_file("static/cabins/Sjekkliste.pdf")
        email.attach_file("static/cabins/Reglement.pdf")
        contract_pdf = html_to_pdf("contract_template.html", content)
        email.attach("Kontrakt.pdf", contract_pdf, "application/pdf")
    email.send()


def html_to_pdf(template_src, context_dict={}):
    html_string = render_to_string(template_src, context_dict)
    html = HTML(string=html_string)
    buffer = io.BytesIO()
    html.write_pdf(target=buffer)
    pdf = buffer.getvalue()
    return pdf
