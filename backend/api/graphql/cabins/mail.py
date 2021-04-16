from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template
from django.utils.html import strip_tags


user_templates = {
    "reserve_booking": "user_reserve_template.html",
    "confirm_booking": "user_confirm_template.html",
}

admin_templates = {
    "reserve_booking": "admin_reserve_template.html",
    "confirm_booking": "admin_confirm_template.html",
}


def send_admin_reservation_mail(booking_info: dict) -> None:
    template = admin_templates["reserve_booking"]
    html_content = get_template(template).render(booking_info)
    text_content = strip_tags(html_content)

    email = EmailMultiAlternatives(
        "Booking av indøkhytte", body=text_content, bcc=[booking_info["receiver_email"]]
    )
    email.attach_alternative(html_content, "text/html")
    email.send()


def send_user_reservation_mail(booking_info: dict) -> None:
    template = user_templates["reserve_booking"]
    html_content = get_template(template).render(booking_info)
    text_content = strip_tags(html_content)

    email = EmailMultiAlternatives(
        "Bekreftelse på booking av indøkhytte",
        body=text_content,
        bcc=[booking_info["receiver_email"]],
    )
    email.attach_alternative(html_content, "text/html")
    email.attach_file("static/cabins/Sjekkliste.pdf")
    email.attach_file("static/cabins/Reglement.pdf")
    email.send()
