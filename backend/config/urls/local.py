from django.conf import settings
from django.urls import path
from graphene_django.views import GraphQLView

from .base import urlpatterns

urlpatterns += [path(settings.GRAPHQL_URL, GraphQLView.as_view(graphiql=True))]
