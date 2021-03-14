import graphene
from django.contrib.auth import get_user_model
from graphene_django import DjangoObjectType


class UserType(DjangoObjectType):
    grade_year = graphene.Int(source="grade_year")

    class Meta:
        model = get_user_model()

        fields = [
            "id",
            "lastLogin",
            "username",
            "firstName",
            "lastName",
            "email",
            "dateJoined",
            "feideUserid",
            "feideEmail",
            "idToken",
            "allergies",
            "phoneNumber",
            "firstLogin",
            "graduationYear",
            "memberships",
            "events",
            "gradeYear",
        ]