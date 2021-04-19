from datetime import datetime
from email.mime.image import MIMEImage
from email.mime.text import MIMEText
from pathlib import Path

from django.core.mail import EmailMultiAlternatives, send_mail
from django.template.loader import get_template, render_to_string
from static.cabins.mailcontent import get_no_html_mail


def sendmail(ctx, subject, receiver, mailtype):
    content = (
        get_template("usermail.html").render(ctx)
        if mailtype == "user"
        else get_template("adminmail.html").render(ctx)
    )
    no_html_content = (
        get_no_html_mail(ctx, "user")
        if mailtype == "user"
        else get_no_html_mail(ctx, "admin")
    )
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

    user_subject = "Bekreftelsesmail for booking av Indøkhytte"
    admin_subject = "Booking av Indøkhytte"

    # send_mail(user_subject, get_no_html_mail(ctx, "user"), "", [receiverEmail], html_message=render_to_string("usermail.html", ctx))
    # send_mail(admin_subject, get_no_html_mail(ctx, "admin"), "", ["herman.holmoy12@gmail.com"], html_message=render_to_string("adminmail.html", ctx))

    sendmail(ctx, user_subject, receiverEmail, "user")
    sendmail(ctx, admin_subject, "herman.holmoy12@gmail.com", "admin")
