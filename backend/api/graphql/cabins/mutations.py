import graphene
from datetime import datetime
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail

from .types import BookingType
from apps.cabins.models import Booking as BookingModel

from django.template import Context
from django.template.loader import render_to_string, get_template
from django.core.mail import EmailMessage


class CreateBooking(graphene.Mutation):
    class Arguments:
        contact_num = graphene.Int()
        contact_person = graphene.String()
        start_day = graphene.String()  # string "yyyy-mm-dd"
        end_day = graphene.String()

    ok = graphene.Boolean()
    booking = graphene.Field(BookingType)

    def mutate(root, info, contact_num, contact_person, start_day, end_day):
        booking = BookingModel.objects.create(
            contact_num=contact_num,
            contact_person=contact_person,
            start_day=start_day,
            end_day=end_day,
        )
        ok = True
        return CreateBooking(booking=booking, ok=ok)


# fiks: oppdaterer ikke bookingen...
class UpdateBooking(graphene.Mutation):
    class Arguments:
        booking_id = graphene.ID()
        contact_num = graphene.Int()
        contact_person = graphene.String()
        start_day = graphene.String()  # string "yyyy-mm-dd"
        end_day = graphene.String()

    ok = graphene.Boolean()
    booking = graphene.Field(BookingType)

    def mutate(
        root,
        info,
        booking_id,
        contact_num=None,
        contact_person=None,
        start_day=None,
        end_day=None,
    ):
        booking = get_object_or_404(BookingModel, pk=booking_id)
        booking.contact_num = (
            contact_num if contact_num is not None else booking.contact_num
        )
        booking.contact_person = (
            contact_person if contact_person is not None else booking.contact_person
        )
        booking.start_day = start_day if start_day is not None else booking.start_day
        booking.end_day = end_day if end_day is not None else booking.end_day

        ok = True
        return UpdateBooking(booking=booking, ok=ok)


class DeleteBooking(graphene.Mutation):
    class Arguments:
        booking_id = graphene.ID()

    ok = graphene.Boolean()

    def mutate(root, info, booking_id):
        booking = get_object_or_404(BookingModel, pk=booking_id)
        booking.delete()
        ok = True
        return DeleteBooking(ok=ok)



class SendEmail(graphene.Mutation):
    class Arguments: 
        firstname = graphene.String()
        surname = graphene.String()
        receiverEmail = graphene.String()
        bookFrom = graphene.String()
        bookTo = graphene.String()

    ok = graphene.Boolean()

    def mutate(self, info, firstname, surname, receiverEmail, bookFrom, bookTo):
        subject = "Bekreftelsesmail for booking av Indøkhytte"
        senderEmail = "herman.holmoy12@gmail.com"

        startDate = datetime.strptime(bookFrom, "%Y-%m-%d").isoformat()
        endDate = datetime.strptime(bookTo, "%Y-%m-%d").isoformat()
        text = "Legg til i Google Calendar"
        # create link to google cal
        link = f"https://calendar.google.com/calendar/r/eventedit?text={text}&dates={startDate}/{endDate}"

        print("dates", startDate, endDate)
        print("link: ", link)

        ctx = {
            "firstname": firstname, 
            "surname": surname, 
            "fromDate": bookFrom,
            "toDate": bookTo,
            "link": link,
        }

        content = get_template("mailtemplate.html").render(ctx)
        msg = EmailMessage(subject, content, senderEmail, [receiverEmail])
        msg.content_subtype = "html"
        #msg.attach_file("/reglement.txt")
        msg.send()

        ok = True
        return SendEmail(ok=ok)