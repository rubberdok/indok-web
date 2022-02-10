from typing import TypedDict, Union

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


class UserAttendingType(graphene.ObjectType):
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


class GradeDistributionType(graphene.ObjectType):
    category = graphene.String()
    available_slots = graphene.Int()


class AttendableType(DjangoObjectType):
    class Meta:
        model = Attendable
        fields = ["id", "signup_open_date", "deadline", "binding_signup", "price"]


class EventType(DjangoObjectType):
    user_attendance = graphene.Field(UserAttendingType)
    users_on_waiting_list = graphene.List(UserType)
    users_attending = graphene.List(UserType)
    available_slots = graphene.List(GradeDistributionType)
    attendable = graphene.Field(AttendableType)
    allowed_grade_years = graphene.List(graphene.Int)
    is_full = graphene.Boolean()
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
            "has_extra_information",
            "category",
            "image",
            "publisher",
            "short_description",
            "contact_email",
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
    def resolve_user_attendance(event: Event, info) -> UserAttendance:
        user = info.context.user
        if not hasattr(event, "attendable") or event.attendable is None:
            return {
                "is_attending": False,
                "is_on_waiting_list": False,
                "has_bought_ticket": False,
            }

        return {
            "is_attending": user in event.attendable.users_attending,
            "is_on_waiting_list": user in event.attendable.users_on_waiting_list,
            "has_bought_ticket": has_bought_ticket(event, user),
        }

    @staticmethod
    def resolve_is_full(event, info):
        user = info.context.user
        if user is None or not hasattr(event, "attendable") or event.attendable is None:
            return False
        return event.attendable.get_is_full(user.grade_year)

    @staticmethod
    def resolve_allowed_grade_years(event, info):
        grades = [int(grade) for grade in event.allowed_grade_years]
        grades.sort()
        return grades

    @staticmethod
    @login_required
    @PermissionDecorators.is_in_event_organization
    def resolve_users_on_waiting_list(event: Event, info):
        if not hasattr(event, "attendable") or event.attendable is None:
            return []
        return event.attendable.users_on_waiting_list
        # return SignUp.objects.filter(event=event, user__in=event.users_on_waiting_list, is_attending=True)

    @staticmethod
    @login_required
    @PermissionDecorators.is_in_event_organization
    def resolve_users_attending(event: Event, info):
        if not hasattr(event, "attendable") or event.attendable is None:
            return []
        return event.attendable.users_attending
        # return SignUp.objects.filter(event=event, user__in=event.users_attending, is_attending=True)

    @staticmethod
    @login_required
    @PermissionDecorators.is_in_event_organization
    def resolve_available_slots(event: Event, info) -> Union[int, None]:
        if not hasattr(event, "attendable") or event.attendable is None:
            return None
        return event.attendable.total_available_slots

    @staticmethod
    @login_required
    def resolve_attendable(event, info):
        if not hasattr(event, "attendable"):
            return None
        return event.attendable

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
