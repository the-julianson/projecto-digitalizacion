from django.urls import include, path
from rest_framework.routers import DefaultRouter

from document_manager.api.viewsets import EtiquetaViewSet, InternalAreaViewset

router = DefaultRouter()
router.register(r"etiqueta", EtiquetaViewSet, basename="etiqueta")
router.register(r"internal-area", InternalAreaViewset, basename="internal-area")

urlpatterns = [
    path("", include(router.urls)),
]
