import graphene
from graphene_django import DjangoObjectType
import graphene

from apps.cabins.models import Cabin as CabinModel
from apps.cabins.models import Booking as BookingModel


class BookingType(DjangoObjectType):
    price = graphene.Int(source="price")
    number_of_nights = graphene.Int(source="number_of_nights")
    is_internal_price = graphene.Int(source="is_internal_price")

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