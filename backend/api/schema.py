import graphene
from events.schema import Mutations as EventMutations
from events.schema import EventQuery as EventQueries
from cabins.schema import BookingQueries


# should find a way to combine queries from apps events and schema:
# pass all query/mutation classes through Queries and Mutations class, gather in schema var
class Queries(BookingQueries, EventQueries, graphene.ObjectType):
    pass


class Mutations(EventMutations, graphene.ObjectType):
    pass


# schema = graphene.Schema(query=Queries, mutation=Mutations)
schema = graphene.Schema(query=Queries)