from django.conf.urls import url, include
from rest_framework.urlpatterns import format_suffix_patterns
from .views import QuestionnairePage, CreateView, DetailsView, QuestionView, \
    QuestionnaireView,DetailedQuestionView,DetailedQuestionnaireView
from django.conf import settings

urlpatterns = {
    url(r'^$', QuestionnairePage.as_view(), name='questionnaire'),
    url(r'^questionlists/?$', CreateView.as_view(), name="create"),
    url(r'^questionlists/(?P<pk>[0-9]+)/?$', DetailsView.as_view(), name="details"),
    url(r'^question/?$', QuestionView.as_view()),
    url(r'^question/(?P<pk>[0-9]+[-][A-Z]+[0-9]+)/?$', DetailedQuestionView.as_view()),
    url(r'^questionnaire/?$', QuestionnaireView.as_view()),
    url(r'^questionnaire/(?P<pk>[0-9]+)/?$', DetailedQuestionnaireView.as_view()),
}

urlpatterns = format_suffix_patterns(urlpatterns)
