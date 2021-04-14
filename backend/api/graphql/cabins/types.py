import graphene
from graphene_django import DjangoObjectType

from apps.cabins.models import Cabin as CabinModel
from apps.cabins.models import Booking as BookingModel


class BookingType(DjangoObjectType):
    class Meta:
        model = BookingModel


class CabinType(DjangoObjectType):
    class Meta:
        model = CabinModel


class EmailInput(graphene.InputObjectType):
    first_name = graphene.String()
    last_name = graphene.String()
    email = graphene.String()
    phone = graphene.String()
    internal_participants = graphene.Int()
    external_participants = graphene.Int()
    cabin_ids = graphene.List(graphene.String)
    check_in = graphene.String()
    check_out = graphene.String()
    email_type = graphene.String()