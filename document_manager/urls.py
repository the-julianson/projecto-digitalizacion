from django.urls import include, path
from rest_framework.routers import DefaultRouter

from document_manager.api.viewsets import EtiquetaViewSet

router = DefaultRouter()
router.register(r"etiquetas", EtiquetaViewSet, basename="etiqueta")


urlpatterns = [
    path("", include(router.urls)),
]
