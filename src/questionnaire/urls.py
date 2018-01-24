from django.conf.urls import url, include
from rest_framework.urlpatterns import format_suffix_patterns
from .views import QuestionnairePage, CreateView, DetailsView, quest

urlpatterns = {
    url(r'^$', QuestionnairePage.as_view(), name='questionnaire'),
    url(r'^questionlists/?$', CreateView.as_view(), name="create"),
    url(r'^questionlists/(?P<pk>[0-9]+)/?$', DetailsView.as_view(), name="details"),
    url(r'^quest/?$', quest, name='quest'),
}

urlpatterns = format_suffix_patterns(urlpatterns)
