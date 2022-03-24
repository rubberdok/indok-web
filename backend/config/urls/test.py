from config import views
from config.views import CustomGraphQLView
from django.conf import settings
from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from .base import urlpatterns

urlpatterns += [
    path(settings.GRAPHQL_URL, CustomGraphQLView.as_view(graphiql=True)),
    path("/test-session/", csrf_exempt(views.test_session)),
]
