import graphene

from .mutations import LogTicTacToeMutation
from .types import ticTacToeType
from apps.ticTacToe.resolvers import TicTacToeQueries

class TicTacToeMutations(graphene.ObjectType):
    log_tic_tac_toe  = LogTicTacToeMutation.Field()

class TicTacToeQueries(graphene.ObjectType, TicTacToeQueries):
    get_winners_list = graphene.List(ticTacToeType)
