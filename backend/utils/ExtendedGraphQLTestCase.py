from graphene_django.utils.testing import GraphQLTestCase


class ExtendedGraphQLTestCase(GraphQLTestCase):
    def setUp(self) -> None:
        # TODO: Add fields and methods for user authentication
        self.GRAPHQL_URL = "/graphql"

