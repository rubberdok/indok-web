import graphene

from .resolvers import PermissionResolvers


class PermissionQueries(graphene.ObjectType, PermissionResolvers):
    has_permission = graphene.Boolean(permission=graphene.String(required=True))
