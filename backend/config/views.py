from django.contrib.auth import get_user_model, login
from django.http import HttpRequest, JsonResponse
from django.middleware.csrf import get_token
from graphene_django.views import GraphQLView
from sentry_sdk.api import start_transaction


class CustomGraphQLView(GraphQLView):
    def execute_graphql_request(self, request, data, query, variables, operation_name, show_graphiql=False):
        """
        Enables performance tracing for GraphQL calls
        """
        backend = self.get_backend(request)
        if backend and query:
            operation_type = backend.document_from_string(self.schema, query).get_operation_type(operation_name)
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


def test_session(request: HttpRequest):
    print(request)
    try:
        login(
            request,
            get_user_model().objects.get(username="eva_student"),
            backend="django.contrib.auth.backends.ModelBackend",
        )
        return JsonResponse({"username": request.user.username})
    except get_user_model().DoesNotExist:
        return JsonResponse({"username": None})


def csrf(request: HttpRequest):
    return JsonResponse({"csrfToken": get_token(request)})
