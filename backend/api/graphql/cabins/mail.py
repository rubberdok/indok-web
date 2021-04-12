from datetime import datetime
from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template
from django.utils.html import strip_tags


user_templates = {
    "reserve_booking": "user_reserve_template.html",
    "confirm_booking": "user_confirm_template.html"
}

admin_templates = {
    "reserve_booking": "admin_reserve_template.html",
    "confirm_booking": "admin_confirm_template.html",
}


def send_admin_reservation_mail(info, booking_info: dict):
    template = user_templates["reserve_booking"]
    html_content = get_template(template).render(booking_info)
    text_content = strip_tags(html_content)

    email = EmailMultiAlternatives("Booking av indøkhytte", text_content, bcc=[booking_info["email"]])
    email.attach_alternative(html_content, "text/html")
    email.send()


def send_user_reservation_mail(info, booking_info: dict):
    template = user_templates["reserve_booking"]
    html_content = get_template(template).render(booking_info)
    text_content = strip_tags(html_content)

    email = EmailMultiAlternatives("Bekreftelse på booking av indøkhytte", text_content, bcc=[booking_info["email"]])
    email.attach_alternative(html_content, "text/html")
    email.attach_file("static/cabins/Sjekkliste.docx")
    email.attach_file("static/cabins/Reglement.docx")
    email.send()


def calculate_booking_price(email_input, cabins):
    check_in_date = datetime.strptime(email_input.check_in_date, "%d-%m-%Y")
    check_out_date = datetime.strptime(email_input.check_out_date, "%d-%m-%Y")
    range_length = (check_out_date - check_in_date).days
    price_per_night = sum([cabin.internal_price for cabin in cabins]) if email_input.number_indok >= email_input.number_external else sum([cabin.external_price for cabin in cabins])
    return price_per_night * range_length
