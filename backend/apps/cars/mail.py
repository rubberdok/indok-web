from typing import Optional

from utils.mail.streams import TransactionalEmail
from django.template.loader import get_template, render_to_string
from django.utils.html import strip_tags

from apps.cars.models import CarBookingResponsible
from apps.cars.types import CarBookingInfoType, CarAdminTemplateType, CarUserTemplateType, EmailTypes

from weasyprint import HTML
from datetime import datetime
import io

user_templates: CarUserTemplateType = {
    "reserve_subject": "Bekreftelse på mottatt søknad om car_booking av ",
    "decision_subject": "Hytteforeningen har tatt stilling til søknaden din om car_booking av ",
    "reserve_car_booking": "user_reserve_template.html",
    "approve_car_booking": "user_approved_template.html",
    "disapprove_car_booking": "user_disapproved_template.html",
}

admin_templates: CarAdminTemplateType = {
    "reserve_subject": "CarBooking av ",
    "reserve_car_booking": "admin_reserve_template.html",
}


def get_email_subject(chosen_cars_string: str, email_type: str, admin: bool) -> str:
    if admin:
        subject = admin_templates["reserve_subject"]
    else:
        subject = (
            user_templates["reserve_subject"] if email_type == "reserve_car_booking" else user_templates["decision_subject"]
        )

    return subject + chosen_cars_string


def send_mail(car_booking_info: CarBookingInfoType, email_type: EmailTypes, admin: bool) -> None:
    if admin:
        template = admin_templates["reserve_car_booking"]
    else:
        template = user_templates[email_type]

    chosen_cars_names = car_booking_info["cars"].values_list("name", flat=True)
    chosen_cars_string = " og ".join(chosen_cars_names)
    subject = get_email_subject(chosen_cars_string, email_type, admin)
    car_booking_responsible: Optional[CarBookingResponsible] = CarBookingResponsible.objects.filter(active=True).first()

    # Display dates with given format in the mail, get car_booking responsible contact info
    content = {
        **car_booking_info,
        "check_in": car_booking_info["check_in"].strftime("%d-%m-%Y"),
        "check_out": car_booking_info["check_out"].strftime("%d-%m-%Y"),
        "chosen_cars_string": chosen_cars_string,
        "car_booking_responsible_name": f"{car_booking_responsible.first_name} {car_booking_responsible.last_name}",
        "car_booking_responsible_phone": car_booking_responsible.phone,
        "car_booking_responsible_email": car_booking_responsible.email,
        "now_time": datetime.now().strftime("%d.%m.%Y, %H:%M:%S"),
    }

    # HTML content for mail services supporting HTML, text content if HTML isn't supported
    html_content = get_template(template).render(content)
    text_content = strip_tags(html_content)

    email = TransactionalEmail(
        stream="car-booking-confirmations",
        subject=subject,
        body=text_content,
        bcc=[car_booking_responsible.email if admin else car_booking_info["receiver_email"]],
    )
    email.attach_alternative(html_content, "text/html")

    # Don't send attachments to admin nor when a car_booking is disapproved
    if email_type != "disapprove_car_booking" and not admin:
        #email.attach_file("static/cars/Sjekkliste.pdf")
        email.attach_file("static/cabins/Reglement.pdf")
        #email.attach_file("static/cabins/Stamp_brukerveiledning.pdf")
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
