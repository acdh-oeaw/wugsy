from django.urls import include, path, re_path
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
import profiles.urls
import accounts.urls

from . import views
from game.views import GamePage, generate_data
from django.contrib import admin

app_name='wugsy'

urlpatterns = [
    re_path(r'^/?$', views.HomePage.as_view(), name='home'),
    path(r'tour', views.TourPage.as_view(), name='tour'),
    path('questionnaire', include('questionnaire.urls')),
    path('stories', include('stories.urls')),
    path('visual', include('visual.urls')),
    path('insights', include('insights.urls')),
    path('game', include('game.urls')),
    path('health', include('health.urls')),
    path('dictionary', include('dictionary.urls')),
    path(r'', include(accounts.urls, namespace='accounts')),
    path(r'admin', admin.site.urls),
    path(r'about', views.AboutPage.as_view(), name='about'),
    path(r'users', include(profiles.urls)),
]

# User-uploaded files like profile pics need to be served in development
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    import debug_toolbar
    urlpatterns += [path(r'__debug__', include(debug_toolbar.urls))]
