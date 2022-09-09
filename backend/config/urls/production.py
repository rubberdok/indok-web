from config.views.graphql import CustomGraphQLView
from django.conf import settings
from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from config.urls.base import urlpatterns

urlpatterns += [path(settings.GRAPHQL_URL, csrf_exempt(CustomGraphQLView.as_view(graphiql=True)))]
