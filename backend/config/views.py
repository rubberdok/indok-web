from graphene_django.views import GraphQLView
from sentry_sdk.api import start_transaction
from graphql import get_operation_ast, parse


class CustomGraphQLView(GraphQLView):
    def execute_graphql_request(self, request, data, query, variables, operation_name, show_graphiql=False):
        """
        Enables performance tracing for GraphQL calls
        """
        document = parse(query)
        operation_ast = get_operation_ast(document, operation_name)
        if operation_ast and query:
            operation_type = operation_ast.operation
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
