import graphene
from django.core.mail import send_mail, EmailMultiAlternatives

from django.template import Context
from django.template.loader import render_to_string, get_template
from django.core.mail import EmailMessage

from pathlib import Path
from email.mime.image import MIMEImage
from email.mime.text import MIMEText
from static.cabins.mailcontent import get_no_html_mail
from datetime import datetime


def send_admin_mail(ctx, subject, receiver):
    content = get_template("adminmailtemplate.html").render(ctx)
    no_html_content = get_no_html_mail(ctx, "admin")
    image_path = "static/cabins/hyttestyret_logo.png"
    image_name = Path(image_path).name

    msg = EmailMultiAlternatives(subject, no_html_content, "", [receiver])
    msg.attach_alternative(content, "text/html")
    msg.content_subtype = "html"
    msg.mixed_subtype = "related"

    with open(image_path, mode="rb") as f:
        image = MIMEImage(f.read())
        image.add_header("Content-ID", f"<{image_name}>")
        msg.attach(image)

    msg.attach_file("static/cabins/Sjekkliste.docx")
    msg.attach_file("static/cabins/Reglement.docx")

    msg.send()


def send_user_mail(ctx, subject, receiver):
    content = get_template("usermailtemplate.html").render(ctx)
    no_html_content = get_no_html_mail(ctx, "user")
    image_path = "static/cabins/hyttestyret_logo.png"
    image_name = Path(image_path).name

    msg = EmailMultiAlternatives(subject, no_html_content, "", [receiver])
    msg.attach_alternative(content, "text/html")
    msg.content_subtype = "html"
    msg.mixed_subtype = "related"

    with open(image_path, mode="rb") as f:
        image = MIMEImage(f.read())
        image.add_header("Content-ID", f"<{image_name}>")
        msg.attach(image)

    msg.attach_file("static/cabins/Sjekkliste.docx")
    msg.attach_file("static/cabins/Reglement.docx")

    msg.send()


def send_mails(info, firstname, surname, receiverEmail, bookFrom, bookTo, price):
    subject = "Bekreftelsesmail for booking av Indøkhytte"

    start_date = (
        datetime.strptime(bookFrom, "%Y-%m-%d")
        .isoformat()
        .replace("-", "")
        .replace(":", "")
    )  # Google Calendar wants YYYYMMDDThhmmss
    end_date = (
        datetime.strptime(bookTo, "%Y-%m-%d")
        .isoformat()
        .replace("-", "")
        .replace(":", "")
    )
    text = "Hyttetur til Indøkhyttene"
    location = "Oppdal+Skisenter+-+Stølen"
    link = f"https://calendar.google.com/calendar/u/0/r/eventedit?text={text}&dates={start_date}/{end_date}&location={location}"

    ctx = {
        "firstname": firstname,
        "surname": surname,
        "email": receiverEmail,
        "cabin": "Bjørnen",
        "fromDate": bookFrom,
        "toDate": bookTo,
        "price": price,
        "link": link,
    }

    send_user_mail(ctx, subject, receiverEmail)
    send_admin_mail(
        ctx, subject, "herman.holmoy12@gmail.com"
    )  # swap with booking-mail later
