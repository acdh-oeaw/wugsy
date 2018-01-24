from django.conf.urls import url, include
from rest_framework.urlpatterns import format_suffix_patterns
from .views import QuestionnairePage, CreateView, DetailsView, QuestView
from django.conf import settings

urlpatterns = {
    url(r'^$', QuestionnairePage.as_view(), name='questionnaire'),
    url(r'^questionlists/?$', CreateView.as_view(), name="create"),
    url(r'^questionlists/(?P<pk>[0-9]+)/?$', DetailsView.as_view(), name="details"),
    url(r'^quest/?$', QuestView.as_view()),
    url(r'^quest/(?P<pk>[0-9]+)/$', QuestView.as_view()),
}

urlpatterns = format_suffix_patterns(urlpatterns)
