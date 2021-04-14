from datetime import datetime
from typing import List

from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template
from django.utils.html import strip_tags

from apps.cabins.models import Cabin

user_templates = {
    "reserve_booking": "user_reserve_template.html",
    "confirm_booking": "user_confirm_template.html"
}

admin_templates = {
    "reserve_booking": "admin_reserve_template.html",
    "confirm_booking": "admin_confirm_template.html",
}


def send_admin_reservation_mail(booking_info: dict) -> None:
    template = admin_templates["reserve_booking"]
    html_content = get_template(template).render(booking_info)
    text_content = strip_tags(html_content)

    email = EmailMultiAlternatives("Booking av indøkhytte", body=text_content, bcc=[booking_info["email"]])
    email.attach_alternative(html_content, "text/html")
    email.send()


def send_user_reservation_mail(booking_info: dict) -> None:
    template = user_templates["reserve_booking"]
    html_content = get_template(template).render(booking_info)
    text_content = strip_tags(html_content)

    email = EmailMultiAlternatives("Bekreftelse på booking av indøkhytte", body=text_content, bcc=[booking_info["email"]])
    email.attach_alternative(html_content, "text/html")
    email.attach_file("static/cabins/Sjekkliste.docx")
    email.attach_file("static/cabins/Reglement.docx")
    email.send()


def calculate_booking_price(email_input: dict, cabins: List[Cabin]) -> int:
    check_in = datetime.strptime(email_input["check_in"], "%d-%m-%Y")
    check_out = datetime.strptime(email_input["check_out"], "%d-%m-%Y")
    booking_length = (check_out - check_in).days
    price_per_night = sum([cabin.internal_price for cabin in cabins]) if email_input["internal_participants"] >= email_input["external_participants"] else sum([cabin.external_price for cabin in cabins])
    return price_per_night * booking_length
