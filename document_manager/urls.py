from django.urls import include, path
from rest_framework.routers import DefaultRouter

from document_manager.api.viewsets.document import DocumentListCreateView
from document_manager.api.viewsets.document_location import DocumentLocationViewset
from document_manager.api.viewsets.label import InternalAreaViewset, LabelViewSet
from document_manager.api.viewsets.batch import BatchViewSet

router = DefaultRouter()
router.register(r"label", LabelViewSet, basename="label")
router.register(r"document", DocumentListCreateView, basename="document")
router.register(r"document-location", DocumentLocationViewset, basename="document-location")
router.register(r"internal-area", InternalAreaViewset, basename="internal-area")
router.register(r"batch", BatchViewSet, basename="batch")

urlpatterns = [
    path("", include(router.urls)),
]
