from django.conf.urls import include, url
from .views import VisualPage

urlpatterns = [
    url(r'^/?', VisualPage.as_view(), name='visual')
    ]
