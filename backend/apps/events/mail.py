from django.core.mail import EmailMessage


def send_event_emails(receiverEmails, content, subject):
    email = EmailMessage(subject, content, bcc=receiverEmails)
    email.send()
