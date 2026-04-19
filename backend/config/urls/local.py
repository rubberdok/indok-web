from django.conf import settings
from django.urls import path
from graphene_django.views import GraphQLView
from django.views.decorators.csrf import csrf_exempt
from config.views import test as test_views

from config.urls.base import urlpatterns

urlpatterns += [
    path(settings.GRAPHQL_URL, csrf_exempt(GraphQLView.as_view(graphiql=True))),
    path("test-session/", csrf_exempt(test_views.test_session)),
]
