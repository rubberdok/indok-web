from django.core.mail import send_mail
from django.core.mail import EmailMessage


def send_event_emails(info, receiverEmails, content, subject):
    email = EmailMessage(subject, content, bcc=receiverEmails)
    email.send()
