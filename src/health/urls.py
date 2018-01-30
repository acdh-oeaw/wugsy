from django.conf.urls import include, url
from .views import HealthPage

app_name = 'health'
urlpatterns = [
    url(r'^/?$', HealthPage.as_view(), name='health'),
]
