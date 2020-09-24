import graphene
from events.schema import Mutations as EventMutations
from events.schema import EventQuery as EventQueries
from .listing.schema import Query as ListingQueries
from .listing.schema import Mutation as ListingMutation

class Query(ListingQueries, EventQueries):
    pass

class Mutation(ListingMutation, EventMutations):
    pass

schema = graphene.Schema(query=Query, mutation=Mutation)