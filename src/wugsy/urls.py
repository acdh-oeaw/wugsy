from django.conf.urls import include, url
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
import profiles.urls
import accounts.urls
from . import views
from game.views import GamePage, generate_data, game_result

apps = [
    url(r'game/?', include('game.urls')),
    url(r'stories/?', include('stories.urls')),
    url(r'questionnaire/?', include('questionnaire.urls')),
    url(r'insights/?', include('insights.urls')),
]

basepages = [
    url(r'^/?$', views.HomePage.as_view(), name='home'),
    url(r'^about/?', views.AboutPage.as_view(), name='about'),
    url(r'^tour/?', views.AboutPage.as_view(), name='tour'),
    url(r'^users/?', include(profiles.urls, namespace='profiles')),
    url(r'^admin/?', include(admin.site.urls)),
    url(r'^', include(accounts.urls, namespace='accounts')),
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
