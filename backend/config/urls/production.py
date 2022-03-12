from config.views import CustomGraphQLView
from django.conf import settings
from django.urls import path

from .base import urlpatterns

urlpatterns += [
    # ok to csrf exempt the graphql endpoint:
    # https://stackoverflow.com/questions/51764452/403-by-graphene-django-dont-use-csrf-exempt
    path(settings.GRAPHQL_URL, CustomGraphQLView.as_view(graphiql=True))
]
