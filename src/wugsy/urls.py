from django.conf.urls import include, url, re_path
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
import profiles.urls
import accounts.urls
import questionnaire.urls
import game.urls
import stories.urls
import insights.urls

from . import views

apps = [
    url(r'game/?', include(game.urls)),
    url(r'stories/?', include(stories.urls)),
    url(r'questionnaire/?', include(questionnaire.urls)),
    url(r'insights/?', include(insights.urls)),
    url(r'accounts/?', include(accounts.urls)),
]

basepages = [
    url(r'^/?$', views.HomePage.as_view(), name='home'),
    url(r'^about/?', views.AboutPage.as_view(), name='about'),
    url(r'^tour/?', views.TourPage.as_view(), name='tour'),
    url(r'^users/?', views.UsersPage.as_view(), name='users'),
    url(r'^admin/?', views.AdminPage.as_view(), name='admin'),
]

urlpatterns = apps + basepages
# User-uploaded files like profile pics need to be served in development
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Include django debug toolbar if DEBUG is on
if settings.DEBUG:
    import debug_toolbar
    urlpatterns += [
        url(r'^__debug__/', include(debug_toolbar.urls)),
    ]
