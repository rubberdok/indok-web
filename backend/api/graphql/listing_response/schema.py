import graphene

from .types import ListingResponseType
from .resolvers import resolve_respones_by_listing_id

class ListingResponseQueries(graphene.ObjectType):
    responses_by_listing_id = graphene.List(ListingResponseType, id=graphene.ID())

    def resolve_responses_by_listing_id(root, info, id):
        return