import graphene
from events.schema import EventQuery


class Query(EventQuery):
    pass


schema = graphene.Schema(query=Query)