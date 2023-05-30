from django.urls import include, path
from rest_framework.routers import DefaultRouter

from document_manager.api.viewsets import LabelViewSet

router = DefaultRouter()
router.register(r"labels", LabelViewSet, basename="label")


urlpatterns = [
    path("", include(router.urls)),
]
