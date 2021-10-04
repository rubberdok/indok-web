from .helpers import create_attendable, create_slot_distributions, update_slot_distributions
from django.db import transaction
import graphene
from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from django.utils import timezone
from graphql_jwt.decorators import login_required, staff_member_required
from utils.decorators import permission_required

from ..organizations.models import Organization
from ..organizations.permissions import check_user_membership
from .mail import send_event_emails
from .models import Category, Event, SignUp
from .types import CategoryType, EventType, GradeDistributionType


class BaseEventInput(graphene.InputObjectType):
    title = graphene.String(required=True)
    description = graphene.String(required=True)
    start_time = graphene.DateTime(required=True)
    end_time = graphene.DateTime(required=False)
    location = graphene.String(required=False)
    category_id = graphene.ID(required=False)
    image = graphene.String(required=False)
    short_description = graphene.String(required=False)
    contact_email = graphene.String(required=False)
    allowed_grade_years = graphene.List(graphene.Int)


class CreateAttendableInput(graphene.InputObjectType):
    signup_open_date = graphene.DateTime(required=True)
    binding_signup = graphene.Boolean(required=False)
    deadline = graphene.DateTime(required=False)
    price = graphene.Float(required=False)


class CreateSlotDistributionInput(graphene.InputObjectType):
    available_slots = graphene.Int(required=True)
    grade_years = graphene.List(GradeDistributionType)


class CreateEventInput(BaseEventInput):
    organization_id = graphene.ID(required=True)
    attendable_data = graphene.Field(CreateAttendableInput(required=False))
    slot_distribution_data = graphene.Field(CreateSlotDistributionInput(required=False))


class UpdateAttendableInput(graphene.InputObjectType):
    signup_open_date = graphene.DateTime(required=False)
    binding_signup = graphene.Boolean(required=False)
    deadline = graphene.DateTime(required=False)
    price = graphene.Float(required=False)


class UpdateSlotDistributionInput(graphene.InputObjectType):
    available_slots = graphene.Int(required=False)
    grade_years = graphene.List(GradeDistributionType)


class UpdateEventInput(BaseEventInput):
    title = graphene.String(required=False)
    description = graphene.String(required=False)
    start_time = graphene.DateTime(required=False)
    organization_id = graphene.ID(required=False)
    attendable_data = graphene.Field(UpdateAttendableInput(required=False))
    slot_distribution_data = graphene.Field(UpdateSlotDistributionInput(required=False))


class CreateEvent(graphene.Mutation):
    """
    Create a new event, optionally also an attendable object and one or more slot distribution objects
    """

    ok = graphene.Boolean()
    event = graphene.Field(EventType)

    class Arguments:
        event_data = CreateEventInput(required=True)

    @permission_required("events.add_event")
    def mutate(self, info, event_data):
        try:
            organization = Organization.objects.get(id=event_data.get("organization_id"))
        except Organization.DoesNotExist:
            raise ValueError("Ugyldig organisasjon oppgitt")

        check_user_membership(info.context.user, organization)

        with transaction.atomic():  # Make atomic so if the creation of one object fails, no changes will be made to the database
            attendable_data = event_data.pop("attendable_data") if event_data.has_key("attendable_data") else None
            slot_distribution_data = (
                event_data.pop("slot_distribution_data") if event_data.has_key("slot_distribution_data") else None
            )

            # Create event
            event = Event()
            for k, v in event_data.items():
                setattr(event, k, v)
            event.publisher = info.context.user
            event.save()

            # Create attendable if included in input data
            attendable = None
            if attendable_data is not None:
                if slot_distribution_data is None:
                    raise ValueError(
                        "Du må minimum spesifisere antall plasser og når påmeldingen åpner for å kunne lage et evearrangement med påmelding"
                    )

                attendable = create_attendable(attendable_data, event)

            # Create slot distribution(s) if included in input data
            if slot_distribution_data is not None:
                if attendable is None:
                    raise ValueError(
                        "Du må minimum spesifisere antall plasser og når påmeldingen åpner for å kunne lage et arrangement med påmelding"
                    )

                slot_dist = create_slot_distributions(slot_distribution_data, attendable)

                if slot_dist.grades.sort() != [int(val) for val in event.total_allowed_grade_years].sort():
                    raise ValueError("Inkonsistens i plassfordeling mellom trinn")

        ok = True
        return CreateEvent(event=event, ok=ok)


class UpdateEvent(graphene.Mutation):
    """
    Updates the event with a given ID with the data in event_data
    """

    class Arguments:
        id = graphene.ID(required=True)
        is_attendable = graphene.Boolean(required=True)
        has_grade_distributions = graphene.Boolean(required=True)
        event_data = UpdateEventInput(required=False)

    ok = graphene.Boolean()
    event = graphene.Field(EventType)

    @permission_required("events.change_event")
    def mutate(self, info, id, is_attendable, has_grade_distributions, event_data):
        try:
            event = Event.objects.get(pk=id)
        except Event.DoesNotExist:
            raise ValueError("Ugyldig arrangement")

        check_user_membership(info.context.user, event.organization)

        with transaction.atomic():  # Make atomic so if the update of one object fails, no changes will be made to the database
            attendable_data = event_data.pop("attendable_data") if event_data.has_key("attendable_data") else None
            slot_distribution_data = (
                event_data.pop("slot_distribution_data") if event_data.has_key("slot_distribution_data") else None
            )

            # Update event
            for k, v in event_data.items():
                setattr(event, k, v)
            event.save()

            # Update attendable if included in input data
            attendable = event.attendable if hasattr("attendable") else None
            if attendable_data is not None:
                # If the event was changed to be attendable, create attendable object and one or more slot distributions
                if attendable is None:
                    attendable = create_attendable(attendable_data, event)
                    if slot_distribution_data is None:
                        raise ValueError(
                            "Du må minimum spesifisere antall plasser og når påmeldingen åpner for å kunne lage et arrangement med påmelding"
                        )
                    create_slot_distributions(slot_distribution_data, attendable)
                    ok = True
                    return UpdateEvent(event=event, ok=ok)

                # If the event was already attendable
                price = (
                    attendable_data.price
                    if attendable_data.has_key("price")
                    else event.attendable.price
                    if hasattr(event.attendable, "price")
                    else None
                )
                binding_signup = (
                    attendable_data.binding_signup
                    if attendable_data.has_key("binding_signup")
                    else attendable.binding_signup
                )
                if price is not None and binding_signup == False:
                    raise ValueError("Betalt påmelding krever bindende påmelding")

                for k, v in attendable_data.items():
                    setattr(attendable, k, v)
                attendable.save()

            # Update slot distributions if included in input data
            if slot_distribution_data is not None:
                if attendable is None:
                    raise ValueError("Betalt påmelding krever bindende påmelding")

                slot_dist = update_slot_distributions(
                    slot_distribution_data, attendable.slot_distribution, has_grade_distributions
                )

                if slot_dist.grades.sort() != [int(val) for val in event.total_allowed_grade_years].sort():
                    raise ValueError("Inkonsistens i plassfordeling mellom trinn")

            # Prevuisly attendable event made non-attendable (no need for sign up)
            if not is_attendable and attendable is not None:
                attendable.delete()  # Cascaded to slot distrbution(s)

        ok = True
        return UpdateEvent(event=event, ok=ok)


class DeleteEvent(graphene.Mutation):
    """
    Deletes the event with the given ID, deletion will also cascade to any related attendable and slot distribution objects
    """

    class Arguments:
        id = graphene.ID()

    ok = graphene.Boolean()
    event = graphene.Field(EventType)

    @permission_required("events.delete_event")
    def mutate(self, info, id):
        try:
            event = Event.objects.get(pk=id)
        except Event.DoesNotExist:
            raise ValueError("Ugyldig arrangement")

        check_user_membership(info.context.user, event.organization)

        event.delete()
        ok = True
        return DeleteEvent(event=event, ok=ok)


class EventSignUpInput(graphene.InputObjectType):
    extra_information = graphene.String(required=False)


class EventSignUp(graphene.Mutation):
    """
    Creates a new Sign Up for the user that sent the request, for the event
    with the given ID
    """

    class Arguments:
        event_id = graphene.ID(required=True)
        data = EventSignUpInput(required=False)

    is_full = graphene.Boolean()
    event = graphene.Field(EventType)

    @permission_required("events.add_signup")
    def mutate(self, info, event_id, data):
        try:
            event = Event.objects.get(pk=event_id)
        except Event.DoesNotExist:
            raise ValueError("Ugyldig arrangement")

        now = timezone.now()

        if now < event.signup_open_date:
            raise Exception("Arrangementet er ikke åpent for påmelding enda")

        user = info.context.user

        if not str(user.grade_year) in event.total_allowed_grade_years:
            raise PermissionDenied(
                "Kun studenter i følgende trinn kan melde seg på",
                event.total_allowed_grade_years,
            )

        if SignUp.objects.filter(event_id=event_id, is_attending=True, user_id=info.context.user.id).exists():
            raise Exception("Du kan ikke melde deg på samme arrangement flere ganger")

        sign_up = SignUp()
        if data.extra_information:
            setattr(sign_up, "extra_information", data.extra_information)

        setattr(sign_up, "timestamp", now)
        setattr(sign_up, "is_attending", True)
        setattr(sign_up, "event", event)
        setattr(sign_up, "user", user)
        setattr(sign_up, "user_email", user.email)
        setattr(sign_up, "user_allergies", user.allergies)
        setattr(sign_up, "user_phone_number", user.phone_number)
        setattr(sign_up, "user_grade_year", user.grade_year)

        sign_up.save()
        is_full = event.get_is_full(user.grade_year)
        return EventSignUp(event=event, is_full=is_full)


class EventSignOff(graphene.Mutation):
    """
    Sets the field is_attending to False in the Sign Up for the user that
    sent the request, for the event with the given ID
    NOTE: The sign up still exists, it is not deleted from the database
          when a user signs off an event
    """

    class Arguments:
        event_id = graphene.ID(required=True)

    is_full = graphene.Boolean()
    event = graphene.Field(EventType)

    @permission_required("events.change_signup")
    def mutate(self, info, event_id):
        try:
            event = Event.objects.get(pk=event_id)
        except Event.DoesNotExist:
            raise ValueError("Ugyldig arrangement")

        user = info.context.user

        users_attending, _ = event.get_attendance_and_waiting_list()
        if event.attendable.binding_signup and user in users_attending:
            raise Exception("Du kan ikke melde deg av et arrangement med bindende påmelding.")

        try:
            sign_up = SignUp.objects.get(is_attending=True, user=user, event=event)
        except SignUp.DoesNotExist:
            raise Exception("Du er ikke påmeldt")

        setattr(sign_up, "is_attending", False)
        sign_up.save()
        is_full = event.get_is_full(user.grade_year)
        return EventSignOff(event=event, is_full=is_full)


class AdminEventSignOff(graphene.Mutation):
    """
    Sets the field is_attending to False in the Sign Up for the user with the
    given ID, for the event with the given ID
    NOTE: The sign up still exists, it is not deleted from the database
          when a user signs off an event
    """

    class Arguments:
        event_id = graphene.ID(required=True)
        user_id = graphene.ID(required=True)

    event = graphene.Field(EventType)

    @permission_required("events.change_signup")
    def mutate(self, info, event_id, user_id):
        try:
            event = Event.objects.get(pk=event_id)
        except Event.DoesNotExist:
            raise ValueError("Ugyldig arrangement")

        check_user_membership(info.context.user, event.organization)

        try:
            user = get_user_model().objects.get(pk=user_id)
        except Event.DoesNotExist:
            raise ValueError("Kunne ikke finne brukeren")

        try:
            sign_up = SignUp.objects.get(is_attending=True, user=user, event=event)
        except SignUp.DoesNotExist:
            raise Exception("Kunne ikke finne påmeldingen")

        setattr(sign_up, "is_attending", False)
        sign_up.save()

        return AdminEventSignOff(event=event)


class CategoryInput(graphene.InputObjectType):
    name = graphene.String(required=False)


class CreateCategory(graphene.Mutation):
    """
    Create a new event category
    """

    ok = graphene.Boolean()
    category = graphene.Field(CategoryType)

    class Arguments:
        category_data = CategoryInput(required=True)

    @staff_member_required
    def mutate(self, info, category_data):
        category = Category()
        for k, v in category_data.items():
            setattr(category, k, v)
        category.save()
        ok = True
        return CreateCategory(category=category, ok=ok)


class UpdateCategory(graphene.Mutation):
    """
    Updates the category with a given ID with the data in category_data
    """

    class Arguments:
        id = graphene.ID(required=True)
        category_data = CategoryInput(required=False)

    ok = graphene.Boolean()
    category = graphene.Field(CategoryType)

    @staff_member_required
    def mutate(self, info, id, category_data):
        category = get_object_or_404(Category, pk=id)

        for k, v in category_data.items():
            setattr(category, k, v)
        category.save()
        ok = True
        return UpdateCategory(category=category, ok=ok)


class DeleteCategory(graphene.Mutation):
    """
    Deletes the category with a given ID
    """

    class Arguments:
        id = graphene.ID()

    ok = graphene.Boolean()
    category = graphene.Field(CategoryType)

    @staff_member_required
    def mutate(self, info, id):
        category = get_object_or_404(Category, pk=id)
        category.delete()
        ok = True
        return DeleteCategory(category=category, ok=ok)


class SendEventEmails(graphene.Mutation):
    """
    Send an email to all users signed up to an event
    """

    class Arguments:
        event_id = graphene.ID(required=True)
        receiverEmails = graphene.List(graphene.String)
        content = graphene.String()
        subject = graphene.String()

    ok = graphene.Boolean()

    @login_required
    def mutate(self, info, event_id, receiverEmails, content, subject):
        try:
            event = Event.objects.get(pk=event_id)
        except Event.DoesNotExist:
            raise ValueError("Ugyldig arrangement")

        check_user_membership(info.context.user, event.organization)

        send_event_emails(receiverEmails, content, subject)

        ok = True
        return SendEventEmails(ok=ok)
