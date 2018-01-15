from django.shortcuts import render
from django.views import generic
from django.http import HttpResponse, JsonResponse
from wugsy.utils import REQUESTED, PROVIDED, _validator
from wugsy.decide import DecideGame
from rest_framework.decorators import api_view

class GamePage(generic.TemplateView):
    template_name = "game.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        print(self.request.user)
        return context

def _generate_game_data(given, user):
    """
    From posted data, construct a new language game
    """
    decider = DecideGame(given, user)
    return decider.to_dict()

@api_view(['GET', 'POST'])
def generate_data(request):
    """
    Get data for a new Game
    """
    assert request.method == 'POST', 'Can only POST here'
    given_data = request.data
    user = request.user
    out_data = _generate_game_data(given_data, user)
    assert _validator(out_data, PROVIDED)
    return JsonResponse(out_data)
