from django.conf.urls import include, url
from .views import GamePage

urlpatterns = [
    url(r'', GamePage.as_view(), name='game'),
]
