from django.conf.urls import include, url
from .views import StoryPage, get_story, story_reaction

urlpatterns = [
    url(r'^$', StoryPage.as_view(), name='stories'),
    url(r'^get_story$', get_story, name='get_story'),
    url(r'^story_reaction$', story_reaction, name='story_reaction'),
]
