import graphene
from django.contrib.auth import get_user_model
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required
from utils.decorators import get_resolver_parent, permission_required_or_none


class UserType(DjangoObjectType):
    grade_year = graphene.Int(source="grade_year")
    events = graphene.List("apps.events.types.EventType", source="events")
    allergies = graphene.String(required=False)

    class Meta:
        model = get_user_model()

        fields = [
            "id",
            "last_login",
            "username",
            "first_name",
            "last_name",
            "email",
            "date_joined",
            "feide_userid",
            "feide_email",
            "id_token",
            "phone_number",
            "first_login",
            "graduation_year",
            "memberships",
            "events",
            "organizations",
            "responses",
            "year_updated_at",
        ]

    @staticmethod
    @login_required
    @permission_required_or_none("users.view_sensitive_info", fn=get_resolver_parent)
    def resolve_allergies(parent, info):
        return parent.allergies
