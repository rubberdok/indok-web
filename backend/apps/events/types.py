from typing import TypedDict

import graphene
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required

from apps.ecommerce.models import Order, Product
from apps.ecommerce.types import ProductType
from apps.users.models import User
from apps.users.types import UserType

from .models import Attendable, Category, Event, SignUp

UserAttendance = TypedDict(
    "UserAttendance", {"is_attending": bool, "is_on_waiting_list": bool, "has_bought_ticket": bool}
)


def has_bought_ticket(event: Event, user: User) -> bool:
    return (
        event.products.exists()
        and Order.objects.filter(
            product=event.products.get(),
            user=user,
            payment_status__in=[
                Order.PaymentStatus.RESERVED,
                Order.PaymentStatus.CAPTURED,
            ],
        ).exists()
    )


class UserAttendanceType(graphene.ObjectType):
    is_attending = graphene.Boolean()
    is_on_waiting_list = graphene.Boolean()
    has_bought_ticket = graphene.Boolean()


class SignUpType(DjangoObjectType):
    has_bought_ticket = graphene.Boolean()
    user_allergies = graphene.String()

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
            "user_phone_number",
            "user_grade_year",
        ]

    @staticmethod
    def resolve_user_allergies(parent: SignUp, info) -> str:
        return parent.user.allergies

    @staticmethod
    def resolve_has_bought_ticket(sign_up: SignUp, info) -> bool:
        return has_bought_ticket(sign_up.event, sign_up.user)


class AttendableType(DjangoObjectType):
    user_attendance = graphene.Field(UserAttendanceType)
    users_on_waiting_list = graphene.List(UserType)
    users_attending = graphene.List(UserType)
    is_full = graphene.Boolean()
    slot_distribution = graphene.types.generic.GenericScalar()

    class Meta:
        model = Attendable
        fields = [
            "id",
            "signup_open_date",
            "deadline",
            "binding_signup",
            "price",
            "has_extra_information",
            "total_available_slots",
        ]

    class PermissionDecorators:
        @staticmethod
        def is_in_event_organization(resolver):
            def wrapper(attendable: Attendable, info):
                user = info.context.user
                if user.memberships.filter(organization=attendable.event.organization).exists() or user.is_superuser:
                    return resolver(attendable, info)
                else:
                    raise PermissionError(
                        f"Du må være medlem av organisasjonen {attendable.organization.name} for å gjøre dette kallet"
                    )

            return wrapper

    @staticmethod
    @login_required
    def resolve_user_attendance(attendable: Attendable, info) -> UserAttendance:
        user = info.context.user
        if user is None:
            return {
                "is_attending": False,
                "is_on_waiting_list": False,
                "has_bought_ticket": False,
            }

        return {
            "is_attending": user in attendable.users_attending,
            "is_on_waiting_list": user in attendable.users_on_waiting_list,
            "has_bought_ticket": has_bought_ticket(attendable.event, user),
        }

    @staticmethod
    @login_required
    def resolve_slot_distribution(attendable: Attendable, info) -> UserAttendance:
        return attendable.slot_distribution

    @staticmethod
    def resolve_is_full(attendable: Attendable, info):
        user = info.context.user
        if user is None:
            return False
        return attendable.get_is_full(user.grade_year)

    @staticmethod
    @login_required
    @PermissionDecorators.is_in_event_organization
    def resolve_users_on_waiting_list(attendable: Attendable, info):
        return attendable.users_on_waiting_list

    @staticmethod
    @login_required
    @PermissionDecorators.is_in_event_organization
    def resolve_users_attending(attendable: Attendable, info):
        return attendable.users_attending


class EventType(DjangoObjectType):
    attendable = graphene.Field(AttendableType)
    allowed_grade_years = graphene.List(graphene.Int)
    product = graphene.Field(ProductType)

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
            "publisher",
            "short_description",
            "contact_email",
        ]

    @staticmethod
    @login_required
    def resolve_attendable(event, info):
        if not hasattr(event, "attendable") or event.attendable is None:
            return None
        return event.attendable

    @staticmethod
    def resolve_allowed_grade_years(event, info):
        grades = [int(grade) for grade in event.allowed_grade_years]
        grades.sort()
        return grades

    @staticmethod
    def resolve_product(event: Event, info) -> Product:
        try:
            return event.products.get()
        except Product.DoesNotExist:
            return None


class CategoryType(DjangoObjectType):
    class Meta:
        model = Category
        fields = [
            "id",
            "name",
        ]
