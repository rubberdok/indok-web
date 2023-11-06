from typing import Optional

from utils.mail.streams import TransactionalEmail
from django.template.loader import get_template, render_to_string
from django.utils.html import strip_tags

from apps.cars.models import CarBookingResponsible
from apps.cars.types import CarBookingInfoType, AdminTemplateType, UserTemplateType, EmailTypes

from weasyprint import HTML
from datetime import datetime
import io

user_templates: UserTemplateType = {
    "reserve_subject": "Bekreftelse på mottatt søknad om booking av ",
    "decision_subject": "Hytteforeningen har tatt stilling til søknaden din om booking av ",
    "reserve_booking": "user_reserve_template.html",
    "approve_booking": "user_approved_template.html",
    "disapprove_booking": "user_disapproved_template.html",
}

admin_templates: AdminTemplateType = {
    "reserve_subject": "Booking av ",
    "reserve_booking": "admin_reserve_template.html",
}


def get_email_subject(chosen_cars_string: str, email_type: str, admin: bool) -> str:
    if admin:
        subject = admin_templates["reserve_subject"]
    else:
        subject = (
            user_templates["reserve_subject"] if email_type == "reserve_booking" else user_templates["decision_subject"]
        )

    return subject + chosen_cars_string


def send_mail(booking_info: CarBookingInfoType, email_type: EmailTypes, admin: bool) -> None:
    if admin:
        template = admin_templates["reserve_booking"]
    else:
        template = user_templates[email_type]

    chosen_cars_names = booking_info["cars"].values_list("name", flat=True)
    chosen_cars_string = " og ".join(chosen_cars_names)
    subject = get_email_subject(chosen_cars_string, email_type, admin)
    booking_responsible: Optional[CarBookingResponsible] = CarBookingResponsible.objects.filter(
        active=True).first()

    # Display dates with given format in the mail, get booking responsible contact info
    content = {
        **booking_info,
        "check_in": booking_info["check_in"].strftime("%d-%m-%Y"),
        "check_out": booking_info["check_out"].strftime("%d-%m-%Y"),
        "chosen_cars_string": chosen_cars_string,
        "booking_responsible_name": f"{booking_responsible.first_name} {booking_responsible.last_name}",
        "booking_responsible_phone": booking_responsible.phone,
        "booking_responsible_email": booking_responsible.email,
        "now_time": datetime.now().strftime("%d.%m.%Y, %H:%M:%S"),
    }

    # HTML content for mail services supporting HTML, text content if HTML isn't supported
    html_content = get_template(template).render(content)
    text_content = strip_tags(html_content)

    email = TransactionalEmail(
        stream="cabin-booking-confirmations",
        subject=subject,
        body=text_content,
        bcc=[booking_responsible.email if admin else booking_info["receiver_email"]],
    )
    email.attach_alternative(html_content, "text/html")

    # Don't send attachments to admin nor when a booking is disapproved
    if email_type != "disapprove_booking" and not admin:
        # pdf files below are for cabins, not cars. Replace if needed
        # email.attach_file("static/cars/Sjekkliste.pdf")
        # email.attach_file("static/cars/Reglement.pdf")
        # email.attach_file("static/cars/Stamp_brukerveiledning.pdf")
        contract_pdf = html_to_pdf("contract_template.html", content)
        email.attach("Kontrakt.pdf", contract_pdf, "application/pdf")
    email.send()


def html_to_pdf(template_src: str, context_dict={}):
    html_string = render_to_string(template_src, context_dict)
    html = HTML(string=html_string)
    buffer = io.BytesIO()
    html.write_pdf(target=buffer)
    pdf = buffer.getvalue()
    return pdf
