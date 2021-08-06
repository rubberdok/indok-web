from datetime import datetime
import json
from typing import Any, Final, Union
from django.db import models
from django.http.response import HttpResponse
import factory
from graphene.utils.str_converters import to_snake_case
from graphene_django.utils.testing import GraphQLTestCase
from graphql_jwt.settings import jwt_settings
from graphql_jwt.shortcuts import get_token

PERMISSION_ERROR_MESSAGE: Final = "You do not have the permissions required."


class ExtendedGraphQLTestCase(GraphQLTestCase):
    def setUp(self) -> None:
        self.GRAPHQL_URL = "/graphql"

    def query(self, query, user=None, **kwargs) -> HttpResponse:
        headers = {}
        if user is not None:
            token = get_token(user)
            headers = {
                jwt_settings.JWT_AUTH_HEADER_NAME: f"{jwt_settings.JWT_AUTH_HEADER_PREFIX} {token}",
            }
        return super().query(query, headers=headers, **kwargs)

    def assert_permission_error(self, response: HttpResponse) -> None:
        self.assertResponseHasErrors(response)
        content = json.loads(response.content)
        self.assertTrue(
            any(
                PERMISSION_ERROR_MESSAGE in error["message"]
                for error in content["errors"]
            ),
            msg=f"Permission error not found in {content.items()}",
        )
        self.assertTrue(
            all(value is None for _, value in content["data"].items()),
            msg=f"Found data in {content['data'].items()}, expected {None}",
        )

    def assert_null_fields(
        self, data: Union[dict[str, Any], list], fields: list[str]
    ) -> None:
        if isinstance(data, dict):
            for k, v in data.items():
                if k in fields:
                    self.assertIsNone(v)
                elif isinstance(v, (list, dict)):
                    self.assert_null_fields(v, fields)
        elif isinstance(data, list):
            for value in data:
                if value in fields:
                    self.assertIsNone(value)
                elif isinstance(value, (list, dict)):
                    self.assert_null_fields(value, fields)

    def deep_assert_equal(
        self, data: dict[str, Any], obj: Union[models.Model, factory.Factory]
    ) -> None:
        for k, v in data.items():
            value = getattr(obj, to_snake_case(k))
            if type(value) == datetime:
                self.assertEqual(v, str(value.isoformat()))
            elif isinstance(value, (models.Model, factory.Factory)):
                self.deep_assert_equal(v, value)
            else:
                self.assertEqual(str(v), str(value))
