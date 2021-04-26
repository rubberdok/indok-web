from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template
from django.utils.html import strip_tags


user_templates = {
    "reserve_subject": "Bekreftelse på mottat søknad om booking",
    "decision_subject": "Hyttestyret har tatt stilling til søknaden din om å booke indøkhyttene",
    "reserve_booking": "user_reserve_template.html",
    "approve_booking": "user_approved_template.html",
    "disapprove_booking": "user_disapproved_template.html",
}

admin_templates = {
    "reserve_subject": "Booking av indøkhyttene",
    "reserve_booking": "admin_reserve_template.html",
}


def send_mail(booking_info: dict, email_type: str, admin: bool) -> None:
    template = admin_templates[email_type] if admin else user_templates[email_type]

    if admin:
        subject = admin_templates["reserve_subject"]
    else:
        subject = (
            user_templates["reserve_subject"]
            if email_type == "reserve_booking"
            else user_templates["decision_subject"]
        )

    html_content = get_template(template).render(booking_info)
    text_content = strip_tags(html_content)

    email = EmailMultiAlternatives(
        subject,
        body=text_content,
        from_email="noreply@indokntnu.no",
        bcc=[booking_info["receiver_email"]],
    )
    email.attach_alternative(html_content, "text/html")

    if email_type != "disapprove_booking" and not admin:
        email.attach_file("static/cabins/Sjekkliste.pdf")
        email.attach_file("static/cabins/Reglement.pdf")

    email.send()
