from sentry_sdk.api import start_transaction
from graphene_django.views import GraphQLView


class CustomGraphQLView(GraphQLView):
    def execute_graphql_request(
        self, request, data, query, variables, operation_name, show_graphiql
    ):
        backend = self.get_backend(request)
        if backend:
            operation_type = backend.document_from_string(
                self.schema, query
            ).get_operation_type(operation_name)
        else:
            operation_type = "http.server"
        with start_transaction(op=operation_type, name=operation_name):
            return super().execute_graphql_request(
                request,
                data,
                query,
                variables,
                operation_name,
                show_graphiql=show_graphiql,
            )
