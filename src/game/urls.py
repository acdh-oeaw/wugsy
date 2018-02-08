from django.urls import include, path, re_path
from .views import GamePage, generate_data, game_result

urlpatterns = [
    re_path('^/?$', GamePage.as_view(), name='game'),
    re_path('^generate_data/', generate_data, name='generate_data'),
    re_path('/?game_result/?', game_result, name='game_result'),
]
