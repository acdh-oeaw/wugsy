from django.conf.urls import include, url
from .views import GamePage, generate_data, game_result

app_name='game'

urlpatterns = [
    url(r'', GamePage.as_view(), name='game'),
    url(r'^generate_data/?', generate_data, name='generate_data'),
    url(r'^game_result/?', game_result, name='game_result'),
]
