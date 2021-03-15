import graphene
from apps.events.models import Event, SignUp, Category
from apps.organizations.permissions import check_user_membership
from django.shortcuts import get_object_or_404
from django.utils import timezone
from graphql_jwt.decorators import login_required, staff_member_required
from apps.organizations.models import Organization

from .mail import send_event_emails
from .types import CategoryType, EventType


class BaseEventInput:
    title = graphene.String(required=True)
    description = graphene.String(required=True)
    start_time = graphene.DateTime(required=True)
    end_time = graphene.DateTime(required=False)
    location = graphene.String(required=False)
    category_id = graphene.ID(required=False)
    image = graphene.String(required=False)
    is_attendable = graphene.Boolean(required=True)
    deadline = graphene.DateTime(required=False)
    signup_open_date = graphene.DateTime(required=False)
    available_slots = graphene.Int(required=False)
    price = graphene.Float(required=False)
    short_description = graphene.String(required=False)
    has_extra_information = graphene.Boolean(required=False)
    contact_email = graphene.String(required=False)
    binding_signup = graphene.Boolean(required=False)


class CreateEventInput(BaseEventInput, graphene.InputObjectType):
    organization_id = graphene.ID(required=True)


class UpdateEventInput(BaseEventInput, graphene.InputObjectType):
    title = graphene.String(required=False)
    description = graphene.String(required=False)
    start_time = graphene.DateTime(required=False)
    organization_id = graphene.ID(required=False)
    is_attendable = graphene.Boolean(required=False)


class CreateEvent(graphene.Mutation):
    ok = graphene.Boolean()
    event = graphene.Field(EventType)

    class Arguments:
        event_data = CreateEventInput(required=True)

    @login_required
    def mutate(self, info, event_data):
        try:
            organization = Organization.objects.get(
                id=event_data.get("organization_id")
            )
        except Organization.DoesNotExist:
            raise ValueError("Ugyldig organisasjon oppgitt")
        check_user_membership(info.context.user, organization)

        event = Event()
        for k, v in event_data.items():
            setattr(event, k, v)
        event.publisher = info.context.user
        event.save()
        ok = True
        return CreateEvent(event=event, ok=ok)


class UpdateEvent(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        event_data = UpdateEventInput(required=False)

    ok = graphene.Boolean()
    event = graphene.Field(EventType)

    @login_required
    def mutate(self, info, id, event_data):
        try:
            event = Event.objects.get(pk=id)
        except Event.DoesNotExist:
            raise ValueError("Ugyldig arrangement")

        check_user_membership(info.context.user, event.organization)

        for k, v in event_data.items():
            setattr(event, k, v)
        event.save()
        ok = True
        return UpdateEvent(event=event, ok=ok)


class DeleteEvent(graphene.Mutation):
    class Arguments:
        id = graphene.ID()

    ok = graphene.Boolean()
    event = graphene.Field(EventType)

    @login_required
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
    class Arguments:
        event_id = graphene.ID(required=True)
        data = EventSignUpInput(required=False)

    is_full = graphene.Boolean()
    event = graphene.Field(EventType)

    @login_required
    def mutate(self, info, event_id, data):
        try:
            event = Event.objects.get(pk=id)
        except Event.DoesNotExist:
            raise ValueError("Ugyldig arrangement")

        user = info.context.user

        sign_up = SignUp()
        if data.extra_information:
            setattr(sign_up, "extra_information", data.extra_information)

        setattr(sign_up, "timestamp", timezone.now())
        setattr(sign_up, "is_attending", True)
        setattr(sign_up, "event", event)
        setattr(sign_up, "user", user)
        setattr(sign_up, "user_email", user.email)
        setattr(sign_up, "user_allergies", user.allergies)
        setattr(sign_up, "user_phone_number", user.phone_number)
        setattr(sign_up, "user_grade_year", user.grade_year)

        sign_up.save()

        return EventSignUp(event=event, is_full=event.is_full)


class EventSignOff(graphene.Mutation):
    class Arguments:
        event_id = graphene.ID(required=True)

    is_full = graphene.Boolean()
    event = graphene.Field(EventType)

    @login_required
    def mutate(self, info, event_id):
        try:
            event = Event.objects.get(pk=id)
        except Event.DoesNotExist:
            raise ValueError("Ugyldig arrangement")

        user = info.context.user

        if event.binding_signup and user in event.users_attending:
            raise Exception(
                "Du kan ikke melde deg av et arrangement med bindende påmelding."
            )

        try:
            sign_up = (
                SignUp.objects.filter(is_attending=True)
                .order_by("-timestamp")
                .get(user=user, event=event)
            )
        except SignUp.DoesNotExist:
            raise Exception("Du er ikke påmeldt")

        setattr(sign_up, "is_attending", False)
        sign_up.save()

        return EventSignOff(event=event, is_full=event.is_full)


class CategoryInput(graphene.InputObjectType):
    name = graphene.String(required=False)


class CreateCategory(graphene.Mutation):
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
    class Arguments:
        id = graphene.ID(required=True)
        category_data = CategoryInput(required=False)

    ok = graphene.Boolean()
    category = graphene.Field(CategoryType)

    @staff_member_required
    def mutate(self, info, category_data):
        category = get_object_or_404(Category, pk=id)

        for k, v in category_data.items():
            setattr(category, k, v)
        category.save()
        ok = True
        return UpdateCategory(category=category, ok=ok)


class DeleteCategory(graphene.Mutation):
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
