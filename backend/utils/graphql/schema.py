import graphene
from .time.resolvers import TimeResolvers

class UtilQueries(graphene.ObjectType, TimeResolvers):
  server_time = graphene.Field(graphene.DateTime)