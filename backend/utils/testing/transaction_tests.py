import json
from datetime import datetime
from typing import Any, Final, Union

import factory
from django.db import models
from django.http.response import HttpResponse
from django.test import Client, TransactionTestCase
from graphene.utils.str_converters import to_snake_case
from graphene_django.utils.testing import graphql_query
from graphql_jwt.settings import jwt_settings
from graphql_jwt.shortcuts import get_token

PERMISSION_ERROR_MESSAGE: Final = "You do not have the permissions required."
ALTERNATE_PERMISSION: Final = "You do not have permission to perform this action"
DEFAULT_GRAPHQL_URL = "/graphql/"


class GraphQLTransactionTestCase(TransactionTestCase):
    """
    Based on: https://www.sam.today/blog/testing-graphql-with-graphene-django/
    """

    # URL to graphql endpoint
    GRAPHQL_URL = DEFAULT_GRAPHQL_URL

    @classmethod
    def setUpClass(cls):
        super(GraphQLTransactionTestCase, cls).setUpClass()

        cls._client = Client()

    def query(self, query, op_name=None, input_data=None, variables=None, headers=None):
        """
        Args:
            query (string)    - GraphQL query to run
            op_name (string)  - If the query is a mutation or named query, you must
                                supply the op_name.  For annon queries ("{ ... }"),
                                should be None (default).
            input_data (dict) - If provided, the $input variable in GraphQL will be set
                                to this value. If both ``input_data`` and ``variables``,
                                are provided, the ``input`` field in the ``variables``
                                dict will be overwritten with this value.
            variables (dict)  - If provided, the "variables" field in GraphQL will be
                                set to this value.
            headers (dict)    - If provided, the headers in POST request to GRAPHQL_URL
                                will be set to this value.

        Returns:
            Response object from client
        """
        return graphql_query(
            query,
            op_name=op_name,
            input_data=input_data,
            variables=variables,
            headers=headers,
            client=self._client,
            graphql_url=self.GRAPHQL_URL,
        )

    def assertResponseNoErrors(self, resp):
        """
        Assert that the call went through correctly. 200 means the syntax is ok, if there are no `errors`,
        the call was fine.
        :resp HttpResponse: Response
        """
        self.assertEqual(resp.status_code, 200)
        content = json.loads(resp.content)
        self.assertNotIn("errors", list(content.keys()))

    def assertResponseHasErrors(self, resp):
        """
        Assert that the call was failing. Take care: Even with errors, GraphQL returns status 200!
        :resp HttpResponse: Response
        """
        content = json.loads(resp.content)
        self.assertIn("errors", list(content.keys()))


class ExtendedGraphQLTransactionTestCase(GraphQLTransactionTestCase):
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
