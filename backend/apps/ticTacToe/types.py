import graphene
from graphene_django import DjangoObjectType

from .models import ticTacToe


class ticTacToeType(DjangoObjectType):
    class Meta:
        model = ticTacToe
