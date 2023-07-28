from rest_framework import viewsets

from document_manager.api.serializers.document_status import (
    DocumentStatusSerializer,
)
from document_manager.models import DocumentStatus


class DocumentStatusViewset(viewsets.ModelViewSet):
    queryset = DocumentStatus.objects.all()
    serializer_class = DocumentStatusSerializer