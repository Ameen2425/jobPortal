from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SavedJobViewSet

router = DefaultRouter()
router.register(r'', SavedJobViewSet, basename='saved_job')

urlpatterns = [
    path('', include(router.urls)),
]
