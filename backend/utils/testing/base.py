import json
from datetime import datetime
from typing import Any, Final, Union

import factory
from django.db import models
from django.http.response import HttpResponse
from graphene.utils.str_converters import to_snake_case
from graphene_django.utils.testing import GraphQLTestCase
from graphql_jwt.settings import jwt_settings
from graphql_jwt.shortcuts import get_token
from django.conf import settings

PERMISSION_ERROR_MESSAGE: Final = "You do not have the permissions required."
ALTERNATE_PERMISSION: Final = "You do not have permission to perform this action"


class ExtendedGraphQLTestCase(GraphQLTestCase):
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
                PERMISSION_ERROR_MESSAGE in error["message"] or ALTERNATE_PERMISSION in error["message"]
                for error in content["errors"]
            ),
            msg=f"Permission error not found in {content.items()}",
        )
        self.assertTrue(
            all(value is None for _, value in content["data"].items()),
            msg=f"Found data in {content['data'].items()}, expected {None}",
        )

    def assert_null_fields(self, data: Union[dict[str, Any], list], fields: list[str]) -> None:
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

    def deep_assert_equal(self, data: dict[str, Any], obj: Union[models.Model, factory.Factory]) -> None:
        for k, v in data.items():
            if hasattr(obj, to_snake_case(k)):
                value = getattr(obj, to_snake_case(k))
                if type(value) == datetime:
                    self.assertEqual(
                        v,
                        str(value.isoformat()),
                        msg=f"{v=}, {str(value.isoformat())=} failed for key {k=}",
                    )
                elif isinstance(value, (models.Model, factory.Factory)):
                    self.deep_assert_equal(v, value)
                elif hasattr(value, "all") and callable(value.all):
                    # Likely a related manager, fetch the objects prior to continuing
                    self.assertEqual(
                        str(v),
                        str(list(value.all())),
                        msg=f"{str(v)=}, {str(list(value.all()))=} failed for key {k=}",
                    )
                else:
                    self.assertEqual(
                        str(v),
                        str(value),
                        msg=f"{str(v)=}, {str(value)=} failed for key {k=}",
                    )
