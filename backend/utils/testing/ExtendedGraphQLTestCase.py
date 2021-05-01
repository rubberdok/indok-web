from graphene_django.utils.testing import GraphQLTestCase
from graphql_jwt.settings import jwt_settings
from graphql_jwt.shortcuts import get_token


class ExtendedGraphQLTestCase(GraphQLTestCase):
    def setUp(self) -> None:
        self.GRAPHQL_URL = "/graphql"

    def query(self, query, user=None, **kwargs):
        headers = {}
        if user is not None:
            token = get_token(user)
            headers = {
                jwt_settings.JWT_AUTH_HEADER_NAME: f"{jwt_settings.JWT_AUTH_HEADER_PREFIX} {token}",
            }
        return super().query(query, headers=headers, **kwargs)
