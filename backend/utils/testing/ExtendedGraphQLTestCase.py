from graphene_django.utils.testing import GraphQLTestCase
from graphql_jwt.shortcuts import get_token


class ExtendedGraphQLTestCase(GraphQLTestCase):
    def setUp(self) -> None:
        # TODO: Add fields and methods for user authentication
        self.GRAPHQL_URL = "/graphql"

    def auth_query(self, query, user, **kwargs):
        token = get_token(user)
        self.query(self, query, headers={"cookie": f"JWT={token}"}, **kwargs)
