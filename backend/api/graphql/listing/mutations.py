import graphene
from apps.listing.models import Listing, Response
from django.contrib.auth.models import Permission
from django.utils.text import slugify
from graphql_jwt.decorators import login_required

from .types import ListingType


class ListingInput(graphene.InputObjectType):
    title = graphene.String(required=False)
    description = graphene.String(required=False)
    start_datetime = graphene.DateTime(required=False)
    end_datetime = graphene.DateTime(required=False)
    deadline = graphene.DateTime(required=False)
    url = graphene.String(required=False)
    organization_id = graphene.ID(required=False)
    survey_id = graphene.ID(required=False)


class CreateListing(graphene.Mutation):
    ok = graphene.Boolean()
    listing = graphene.Field(ListingType)

    class Arguments:
        listing_data = ListingInput(required=True)

    @classmethod
    @login_required
    def mutate(cls, self, info, listing_data):
        listing = Listing()

        for k, v in listing_data.items():
            setattr(listing, k, v)

        setattr(listing, "slug", slugify(listing_data['title']))

        listing.save()
        ok = True
        return cls(listing=listing, ok=ok)

class DeleteListing(graphene.Mutation):
    ok = graphene.Boolean()
    listing_id = graphene.ID()

    class Arguments:
        id = graphene.ID()

    @classmethod
    @login_required
    def mutate(cls, self, info, **kwargs):
        listing = Listing.objects.get(pk=kwargs["id"])
        listing_id = listing.id
        listing.delete()
        ok = True
        return cls(ok=ok, listing_id=listing_id)

class UpdateListing(graphene.Mutation):
    listing = graphene.Field(ListingType)
    ok = graphene.Boolean()

    class Arguments:
        id = graphene.ID(required=True)
        listing_data = ListingInput(required=False)

    @classmethod
    @login_required
    def mutate(cls, self, info, id, listing_data=None):
        listing = Listing.objects.get(pk=id)

        for k, v in listing_data.items():
            setattr(listing, k, v)

        listing.save()
        ok = True
        return cls(listing=listing, ok=ok)

class AddPermission(graphene.Mutation):
    ok = graphene.Boolean()

    class Arguments:
        permission = graphene.String()
    
    @classmethod
    def mutate(cls, self, info, permission):
        user = info.context.user
        user.user_permissions.add(Permission.objects.get(codename=permission))
        user.save()
        ok = True
        return cls(ok=ok)
