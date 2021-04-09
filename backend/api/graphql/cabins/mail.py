from django.core.mail import EmailMultiAlternatives

from django.template.loader import get_template


from django.utils.html import strip_tags
from apps.cabins.models import Cabin as CabinModel


def send_admin_mail(info, booking_info: dict):
    html_content = get_template("adminmailtemplate.html").render(booking_info)
    text_content = strip_tags(html_content)

    email = EmailMultiAlternatives("Booking av indøkhytte", text_content, bcc=[booking_info["email"]])
    email.attach_alternative(html_content, "text/html")
    email.send()


def send_user_confirmation_mail(info, booking_info: dict):
    html_content = get_template("usermailtemplate.html").render(booking_info)
    text_content = strip_tags(html_content)

    email = EmailMultiAlternatives("Bekreftelse på booking av indøkhytte", text_content, bcc=[booking_info["email"]])
    email.attach_alternative(html_content, "text/html")
    email.attach_file("static/cabins/Sjekkliste.docx")
    email.attach_file("static/cabins/Reglement.docx")
    email.send()


def calculate_booking_price(cabins: list[CabinModel], number_indok: int, number_external: int):
    return sum([cabin.internal_price for cabin in cabins]) if number_indok >= number_external else sum([cabin.external_price for cabin in cabins])
