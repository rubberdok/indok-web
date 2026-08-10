from graphene_django.views import GraphQLView
from graphql import get_operation_ast, parse
from sentry_sdk.api import start_transaction


class CustomGraphQLView(GraphQLView):
    def execute_graphql_request(
        self, request, data, query, variables, operation_name, show_graphiql=False
    ):
        """
        Enables performance tracing for GraphQL calls
        """
        operation_type = "http.server"
        if query:
            try:
                operation_ast = get_operation_ast(parse(query), operation_name)
                if operation_ast and operation_ast.operation:
                    operation_type = getattr(
                        operation_ast.operation, "value", str(operation_ast.operation)
                    )
            except Exception:
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
