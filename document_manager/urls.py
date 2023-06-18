from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .api.viewsets.document import (
    ConfidentialityViewSet,
    DocumentListCreateView,
    DocumentTypeViewSet,
    StatusViewSet,
)
from .api.viewsets.label import InternalAreaViewset, LabelViewSet

router = DefaultRouter()
router.register(r"label", LabelViewSet, basename="label")
router.register(r"internal-area", InternalAreaViewset, basename="internal-area")
router.register(r"document-type", DocumentTypeViewSet, basename="document-type")
router.register(r"status", StatusViewSet, basename="status")
router.register(r"confidentiality", ConfidentialityViewSet, basename="confidentiality")

urlpatterns = [
    path("", include(router.urls)),
    path('documents/', DocumentListCreateView.as_view(), name='document-list-create'),
]
