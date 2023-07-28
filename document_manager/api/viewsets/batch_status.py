from rest_framework import viewsets

from document_manager.api.serializers.batch_status import (
    BatchStatusSerializer,
)
from document_manager.models import BatchStatus


class BatchStatusViewset(viewsets.ModelViewSet):
    queryset = BatchStatus.objects.all()
    serializer_class = BatchStatusSerializer
