from django.core.mail import EmailMessage


def send_event_emails(receiverEmails, content, subject):
    mail = EmailMessage(subject=subject, from_email="noreply@indokntnu.no", body=content, bcc=receiverEmails)
    mail.send()
