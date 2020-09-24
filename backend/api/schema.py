import graphene
from events.schema import Mutations as EventMutations
from events.schema import EventQuery as EventQueries
from graph.listing.schema import ListingQuery as ListingQueries
from graph.listing.schema import Mutations as ListingMutation

schema = graphene.Schema(query=ListingQueries, mutation=ListingMutation)