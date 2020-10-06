import graphene
import graphql_social_auth


class AuthMutations(graphene.ObjectType):
    social_auth = graphql_social_auth.SocialAuth.Field()