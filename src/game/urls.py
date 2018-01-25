from django.conf.urls import include, url
from .views import GamePage, generate_data, game_result

urlpatterns = [
    url(r'', GamePage.as_view(), name='game'),
    url(r'generate', generate_data, name='generate'),
    url(r'result', game_result, name='result'),
]
