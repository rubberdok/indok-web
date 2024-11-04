from .models import ticTacToe

class TicTacToeQueries:
    def resolve_get_winners_list(self,info):
        return ticTacToe.objects.all()


