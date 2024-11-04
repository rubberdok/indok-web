from django.db import models

class ticTacToe(models.Model):
    game_result = models.CharField(max_length=20)
    timestamp = models.DateTimeField(auto_now_add=True)