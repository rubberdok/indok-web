from graphene_django import DjangoObjectType
import graphene

from .models import Listing


class ListingType(DjangoObjectType):
    chips = graphene.List(graphene.String, required=True)

    class Meta:
        model = Listing
        fields = [
            "id",
            "description",
            "title",
            "start_datetime",
            "end_datetime",
            "application_url",
            "slug",
            "deadline",
            "organization",
            "form",
            "hero_image_url",
            "read_more_url",
            "view_count",
        ]

    def resolve_chips(parent: Listing, info):
        res = []
        if parent.application:
            res.append("application")
        if parent.interview:
            res.append("interview")
        if parent.case:
            res.append("case")
        return res
