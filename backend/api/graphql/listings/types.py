from apps.listings.models import Listing
from graphene_django import DjangoObjectType
import graphene


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
            "url",
            "slug",
            "deadline",
            "organization",
            "form",
        ]

    def resolve_chips(parent: Listing, info):
        res = []
        if parent.application:
            res.append("søknad")
        if parent.case:
            res.append("case")
        if parent.interview:
            res.append("interview")
        return res