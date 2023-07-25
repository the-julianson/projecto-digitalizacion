from django_filters import rest_framework as filters
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated

from document_manager.api.filters import DocumentFilter
from document_manager.api.serializers.document import DocumentSerializer
from document_manager.api.viewsets.custom_mixins import ListCreateViewset
from document_manager.models import Document
from document_manager.models import Batch
from rest_framework.decorators import action
from rest_framework.response import Response


class DocumentListCreateView(ListCreateViewset):
    queryset = Document.objects.select_related("document_type", "label", "confidentiality", "status").all()
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = DocumentFilter
    pagination_class = PageNumberPagination

    @action(detail=False, methods=['get'], url_path='documents-by-batch-id')
    def documents_by_batch_id(self, request):
        """
        Custom action to retrieve documents associated with all batches where the status is 'open'.
        """
        try:
            # Get all batches with status 'open'
            open_batches = Batch.objects.filter(status__status_name='open')
            # Get all documents associated with open batches
            documents = Document.objects.filter(batch__in=open_batches)
            serializer = DocumentSerializer(documents, many=True)
            return Response(serializer.data)
        except Batch.DoesNotExist:
            return Response({"error": "No open batches found"}, status=404)

    