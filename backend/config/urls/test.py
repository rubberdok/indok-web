from config.views import test
from graphene_django.views import GraphQLView
from django.conf import settings
from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from .base import urlpatterns

urlpatterns += [
    path(settings.GRAPHQL_URL, GraphQLView.as_view(graphiql=True)),
    path("test-session/", csrf_exempt(test.test_session)),
]
