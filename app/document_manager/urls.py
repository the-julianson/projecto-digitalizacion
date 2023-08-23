from django.urls import include, path
from rest_framework.routers import DefaultRouter

from document_manager.api.viewsets.batch import BatchViewSet
from document_manager.api.viewsets.batch_status import BatchStatusViewset
from document_manager.api.viewsets.document import DocumentListCreateView
from document_manager.api.viewsets.document_status import DocumentStatusViewset
from document_manager.api.viewsets.label import InternalAreaViewset, LabelViewSet

router = DefaultRouter()
router.register(r"label", LabelViewSet, basename="label")
router.register(r"document", DocumentListCreateView, basename="document")
router.register(r"internal-area", InternalAreaViewset, basename="internal-area")
router.register(r"batch", BatchViewSet, basename="batch")
router.register(r"batch-status", BatchStatusViewset, basename="batch-status")
router.register(r"document-status", DocumentStatusViewset, basename="document-status")

urlpatterns = [
    path("", include(router.urls)),
]
