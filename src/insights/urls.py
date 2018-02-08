from django.conf.urls import include, url
from .views import InsightPage, get_insight, return_data

urlpatterns = [
    url(r'^/?', InsightPage.as_view(),name='insights'),
    url(r'^get_insight/?', get_insight, name='get_insight'),
    url(r'^game_result/?', return_data, name='return_data'),
]
