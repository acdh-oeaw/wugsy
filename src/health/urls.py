from django.conf.urls import include, url
from .views import HealthPage

urlpatterns = [
    url(r'^/?$', HealthPage.as_view(), name='health'),
]
