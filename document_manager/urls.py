from django.urls import include, path
from rest_framework.routers import DefaultRouter

from document_manager.api.viewsets import InternalAreaViewset, LabelViewSet

router = DefaultRouter()
router.register(r"label", LabelViewSet, basename="label")
router.register(r"internal-area", InternalAreaViewset, basename="internal-area")

urlpatterns = [
    path("", include(router.urls)),
]
