import graphene
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required

from ..ecommerce.models import Order
from .models import Category, Event, SignUp


class UserAttendingType(graphene.ObjectType):
    is_signed_up = graphene.Boolean()
    is_on_waiting_list = graphene.Boolean()
    has_bought_ticket = graphene.Boolean()


class SignUpType(DjangoObjectType):
    class Meta:
        model = SignUp
        fields = [
            "id",
            "event",
            "user",
            "timestamp",
            "is_attending",
            "extra_information",
            "user_email",
            "user_allergies",
            "user_phone_number",
            "user_grade_year",
            "order",
        ]


class EventType(DjangoObjectType):
    user_attendance = graphene.Field(UserAttendingType)
    is_full = graphene.Boolean(source="is_full")
    users_on_waiting_list = graphene.List(SignUpType)
    users_attending = graphene.List(SignUpType)
    allowed_grade_years = graphene.List(graphene.Int)
    available_slots = graphene.Int()

    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "start_time",
            "end_time",
            "location",
            "description",
            "organization",
            "category",
            "image",
            "is_attendable",
            "deadline",
            "publisher",
            "price",
            "signup_open_date",
            "short_description",
            "has_extra_information",
            "binding_signup",
            "contact_email",
            "product",
        ]

    class PermissionDecorators:
        @staticmethod
        def is_in_event_organization(resolver):
            def wrapper(event: Event, info):
                user = info.context.user
                if user.memberships.filter(organization=event.organization).exists() or user.is_superuser:
                    return resolver(event, info)
                else:
                    raise PermissionError(
                        f"Du må være medlem av organisasjonen {event.organization.name} for å gjøre dette kallet"
                    )

            return wrapper

    @staticmethod
    def resolve_user_attendance(event, info):
        user = info.context.user
        return {
            "is_signed_up": user in event.users_attending,
            "is_on_waiting_list": user in event.users_on_waiting_list,
            "has_bought_ticket": event.product is not None
            and Order.objects.filter(
                product=event.product,
                user=user,
                payment_status__in=[
                    Order.PaymentStatus.RESERVED,
                    Order.PaymentStatus.CAPTURED,
                ],
            ).exists(),
        }

    @staticmethod
    def resolve_allowed_grade_years(event, info):
        return [int(grade) for grade in event.allowed_grade_years]

    @staticmethod
    @login_required
    @PermissionDecorators.is_in_event_organization
    def resolve_users_on_waiting_list(event, info):
        return SignUp.objects.filter(event=event, user__in=event.users_on_waiting_list, is_attending=True)

    @staticmethod
    @login_required
    @PermissionDecorators.is_in_event_organization
    def resolve_users_attending(event, info):
        return SignUp.objects.filter(event=event, user__in=event.users_attending, is_attending=True)

    @staticmethod
    def resolve_available_slots(event, info):
        user = info.context.user
        if not user.is_authenticated or not user.memberships.filter(organization=event.organization).exists():
            return None
        return event.available_slots


class CategoryType(DjangoObjectType):
    class Meta:
        model = Category
        fields = [
            "id",
            "name",
        ]
