from django.contrib.auth import login
from django.contrib.auth.models import Permission
import graphene

from django.utils.text import slugify

from .types import ListingType, ResponseType
from apps.listing.models import Listing, Response
from graphql_jwt.decorators import login_required, user_passes_test

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
    @user_passes_test(lambda user: user.is_staff)
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
    @user_passes_test(lambda user: user.is_staff)
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
    @user_passes_test(lambda user: user.is_staff)
    def mutate(cls, self, info, id, listing_data=None):
        listing = Listing.objects.get(pk=id)

        for k, v in listing_data.items():
            setattr(listing, k, v)

        listing.save()
        ok = True
        return cls(listing=listing, ok=ok)

class ResponseInput(graphene.InputObjectType):
    response = graphene.String(required=False)
    listing_id = graphene.ID(required=False)

class CreateResponse(graphene.Mutation):
    response = graphene.Field(ResponseType)
    ok = graphene.Boolean()

    class Arguments:
        response_data = ResponseInput(required=True)

    @classmethod
    @login_required
    def mutate(cls, self, info, response_data):
        response = Response()
        user = info.context.user
        for k, v in response_data.items():
            setattr(response, k, v)
        setattr(response, "applicant", user)
        response.save()
        ok = True
        return cls(response=response, ok=ok)

class UpdateResponse(graphene.Mutation):
    response = graphene.Field(ResponseType)
    ok = graphene.Boolean()

    class Arguments:
        response_id = graphene.ID()
        response_data = ResponseInput(required=False)

    @classmethod
    @login_required
    def mutate(cls, self, info, response_id, response_data=None):
        user = info.context.user
        response = user.responses.get(pk=response_id)

        for k, v in response_data.items():
            setattr(response, k, v)
            
        response.save()
        ok = True
        return cls(response=response, ok=ok)

class DeleteResponse(graphene.Mutation):
    response = graphene.Field(ResponseType)
    ok = graphene.Boolean()

    class Arguments:
        response_id = graphene.ID()

    @classmethod
    @login_required
    def mutate(cls, self, info, response_id):
        user = info.context.user
        response = user.responses.get(pk=response_id)
        response.delete()
        ok = True
        return cls(ok=ok)


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