import graphene
from .types import ListingResponseType
from apps.listing_response.models import ListingResponse

class ListingResponseInput(graphene.InputObjectType):
    response = graphene.String(required=False)
    applicant_id = graphene.ID(required=False)
    listing_id = graphene.ID(required=False)

class CreateListingResponse(graphene.Mutation):
    listing_response = graphene.Field(ListingResponseType)
    ok = graphene.Boolean()

    class Arguments:
        listing_response_data = ListingResponseInput(required=True)

    @classmethod
    def mutate(cls, root, info, listing_response_data):
        listing_response = ListingResponse(
            response = listing_response_data['response'],
            applicant_id = listing_response_data['applicant_id'],
            listing_id = listing_response_data['listing_id']
        )

        listing_response.save()
        ok = True
        return cls(listing_response=listing_response, ok=ok)

class UpdateListingResponse(graphene.Mutation):
    listing_response = graphene.Field(ListingResponseType)
    ok = graphene.Boolean()

    class Arguments:
        listing_response_id = graphene.ID()
        listing_response_data = ListingResponseInput(required=False)

    @classmethod
    def mutate(cls, root, info, listing_response_id, listing_response_data=None):
        listing_response = ListingResponse.objects.get(pk=listing_response_id)

        for k, v in listing_response_data.items():
            setattr(listing_response, k, v)

        listing_response.save()
        ok = True
        return cls(listing_response=listing_response, ok=ok)

class DeleteListingResponse(graphene.Mutation):
    listing_response = graphene.Field(ListingResponseType)
    ok = graphene.Boolean()

    class Arguments:
        listing_response_id = graphene.ID()

    @classmethod
    def mutate(cls, root, info, listing_response_id):
        listing_response = ListingResponse.objects.get(pk=listing_response_id)
        listing_response.delete()
        ok = True
        return cls(ok=ok)