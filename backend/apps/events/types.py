import graphene
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required
from .models import Attendable, Category, Event, SignUp


class UserAttendingType(graphene.ObjectType):
    is_signed_up = graphene.Boolean()  # NOTE: Her mener vi kanskje is_attending?
    is_on_waiting_list = graphene.Boolean()


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
        ]


class GradeDistributionType(graphene.ObjectType):
    category = graphene.String()
    available_slots = graphene.Int()


class AttendableType(DjangoObjectType):
    class Meta:
        model = Attendable
        fields = ["id", "signup_open_date", "deadline", "binding_signup", "price"]


class EventType(DjangoObjectType):
    user_attendance = graphene.Field(UserAttendingType)
    users_on_waiting_list = graphene.List(SignUpType)
    users_attending = graphene.List(SignUpType)
    available_slots = graphene.List(GradeDistributionType)
    attendable = graphene.Field(AttendableType)
    allowed_grade_years = graphene.List(graphene.Int)
    is_full = graphene.Boolean()

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
    def resolve_user_attendance(event, info):
        user = info.context.user
        attending, waiting_list = event.get_attendance_and_waiting_list()
        if attending is None:
            return {
                "is_signed_up": False,
                "is_on_waiting_list": False,
            }

        group = None
        for attendant_group in attending.keys():
            if str(user.grade_year) in attendant_group:
                group = attendant_group
                break

        if group is None:
            return {
                "is_signed_up": False,
                "is_on_waiting_list": False,
            }

        return {
            "is_signed_up": user in attending[group],
            "is_on_waiting_list": user in waiting_list[group],
        }

    @staticmethod
    def resolve_is_full(event, info):
        user = info.context.user
        if user is None:
            return False
        return event.get_is_full(user.grade_year)

    @staticmethod
    def resolve_allowed_grade_years(event, info):
        grades = [int(grade) for grade in event.total_allowed_grade_years]
        grades.sort()
        return grades

    @staticmethod
    @login_required
    @PermissionDecorators.is_in_event_organization
    def resolve_users_on_waiting_list(event, info):
        _, waiting_list = event.get_attendance_and_waiting_list()
        if waiting_list is None:
            return []
        all_on_waiting_list = []
        for waiting_list_group in waiting_list.values():
            all_on_waiting_list += waiting_list_group
        return SignUp.objects.filter(event=event, user__in=all_on_waiting_list, is_attending=True)

    @staticmethod
    @login_required
    @PermissionDecorators.is_in_event_organization
    def resolve_users_attending(event, info):
        attending, _ = event.get_attendance_and_waiting_list()
        if attending is None:
            return []
        all_attending = []
        for attending_group in attending.values():
            all_attending += attending_group
        return SignUp.objects.filter(event=event, user__in=all_attending, is_attending=True)

    @staticmethod
    @login_required
    def resolve_available_slots(event, info):
        user = info.context.user
        if not user.memberships.filter(organization=event.organization).exists():
            return None
        return event.available_slots

    @staticmethod
    @login_required
    def resolve_attendable(event, info):
        user = info.context.user
        if not user.memberships.filter(organization=event.organization).exists() or not hasattr(event, "attendable"):
            return None
        return event.attendable


class CategoryType(DjangoObjectType):
    class Meta:
        model = Category
        fields = [
            "id",
            "name",
        ]
