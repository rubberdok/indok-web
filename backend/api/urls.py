"""api URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.urls.conf import include
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView
from graphql_jwt.decorators import jwt_cookie

from apps.ping.views import Ping


urlpatterns = [
    path("admin/", admin.site.urls),
    # ok to csrf exempt the graphql endpoint: https://stackoverflow.com/questions/51764452/403-by-graphene-django-dont-use-csrf-exempt
    path("graphql", csrf_exempt(jwt_cookie(GraphQLView.as_view(graphiql=True)))),
    path("ping", Ping.as_view()),
    path("-/", include("django_alive.urls")),
    path("ecommerce/", include("apps.ecommerce.urls")),
]
