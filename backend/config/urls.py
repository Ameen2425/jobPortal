from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from django.views.static import serve

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/users/', include('accounts.user_urls')),
    path('api/companies/', include('companies.urls')),
    path('api/jobs/', include('jobs.urls')),
    path('api/applications/', include('applications.urls')),
    path('api/saved-jobs/', include('jobs.saved_urls')),
    path('api/notifications/', include('notifications.urls')),
    path('api/interviews/', include('interviews.urls')),
    path('api/ai/', include('ai_engine.urls')),
    path('api/analytics/', include('analytics.urls')),

    # Serve static frontend assets from dist/assets
    re_path(r'^assets/(?P<path>.*)$', serve, {
        'document_root': settings.BASE_DIR.parent / 'frontend' / 'dist' / 'assets',
    }),

    # Catch-all route to serve SPA React index.html for all client routes
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
