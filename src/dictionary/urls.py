from django.conf.urls import include, url
from .views import DictionaryPage

urlpatterns = [
    url(r'^/?', DictionaryPage.as_view(), name='dictionary')
]
