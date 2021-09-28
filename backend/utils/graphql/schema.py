import graphene
from .time.resolvers import TimeResolvers
from .permissions.resolvers import PermissionResolvers


class UtilQueries(graphene.ObjectType, TimeResolvers, PermissionResolvers):
    server_time = graphene.Field(graphene.DateTime)
    has_permission = graphene.Field(graphene.Boolean, permission=graphene.String())
