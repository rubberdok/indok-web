import graphene
from events.schema import Mutations as EventMutations
from events.schema import EventQuery as EventQueries

schema = graphene.Schema(query=EventQueries, mutation=EventMutations)