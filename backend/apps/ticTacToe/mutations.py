from apps.ticTacToe.types import ticTacToeType
from .models import ticTacToe
import graphene

class LogTicTacToeMutation(graphene.Mutation):
    class Arguments:
        winner = graphene.String()

    ok = graphene.Boolean()
    game = graphene.Field(ticTacToeType)

    def mutate(self, info, winner=None):  # Ensure this signature is correct
        game = ticTacToe.objects.create(
            game_result=winner  # Use the 'winner' argument
        )
        ok = True
        return LogTicTacToeMutation(game=game, ok=ok)
