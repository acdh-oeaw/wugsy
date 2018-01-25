from django.shortcuts import render
from django.views import generic
from django.http import HttpResponse, JsonResponse
from wugsy.validate import REQUESTED, PROVIDED, _validator
from wugsy.decide import DecideGame
from rest_framework.decorators import api_view

class GamePage(generic.TemplateView):
    template_name = "game.html"

@api_view(['POST'])
def generate_data(request):
    """
    Frontend will request a game from here, posting session/user data.

    We use this data to generate JSON suitable for a game and then return it
    """
    given_data = request.data
    user = request.user
    decider = DecideGame(given_data, user)
    out_data = decider.to_dict()
    assert _validator(out_data, PROVIDED)
    return JsonResponse(out_data)


@api_view(['POST'])
def game_result(request):
    """
    Save game result to database, and either provide new game or redirect
    """
    given_data = request.data
    user = request.user
    assert _validator(given_data, REQUESTED)
    over = _is_game_over(given_data, user)
    success = _add_to_database(given_data, user)
    if not success:
        raise ValueError('Problem updating database!')
    if over:
        raise NotImplementedError('Not done yet')
    else:
        raise NotImplementedError(" error")
        return generate_data(request)


def _add_to_database(given_data, user):
    """
    Add information to the database
    """
    return True

def _is_game_over(given_data, user):
    """
    Decide if the round of games is over or not
    """
    return False
