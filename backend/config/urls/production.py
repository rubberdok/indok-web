from config.views import CustomGraphQLView
from django.conf import settings
from django.urls import path

from .base import urlpatterns

urlpatterns += [path(settings.GRAPHQL_URL, CustomGraphQLView.as_view(graphiql=True))]
