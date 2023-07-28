from django_filters import rest_framework as filters
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from document_manager.api.filters import DocumentFilter
from document_manager.api.serializers.document import DocumentSerializer
from document_manager.api.viewsets.custom_mixins import ListCreateViewset
from document_manager.models import Document, Batch, DocumentStatus

from rest_framework.decorators import action
from rest_framework.response import Response


class DocumentListCreateView(ListCreateViewset):
    queryset = Document.objects.select_related("document_type", "label", "confidentiality", "status").all()
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = DocumentFilter
    pagination_class = PageNumberPagination

    STATUS_MAPPING = {
        "inicializado": "inicializado",
        "en progreso": "InProgress",
        "escaneado": "Scanned"
    }

    @action(detail=False, methods=['get'], url_path='get-documents-last-batch')
    def documents_by_batch_id(self, request):
        """
        Custom action to retrieve documents associated with all batches where the status is 'open'.
        """
        try:
            # Get all batches with status 'open'
            open_batches = Batch.objects.filter(status__batch_status_name='abierto')
            # Get all documents associated with open batches
            documents = Document.objects.filter(batch__in=open_batches)
            serializer = DocumentSerializer(documents, many=True)
            return Response(serializer.data)
        except Batch.DoesNotExist:
            return Response({"error": "No open batches found"}, status=404)
        
    @action(detail=True, methods=['put'], url_path='manage-status')
    def manage_status(self, request, pk=None):
        """
        Custom action to update the 'status' field of a specific document.
        """
        try:
            document = self.get_object()
            new_status = request.data.get('status')  # Get the new status from the request data

            # Check if the new_status is valid
            valid_statuses = ["inicializado", "en progreso", "escaneado"]
            if new_status not in valid_statuses:
                return Response({"error": "Invalid status provided"}, status=status.HTTP_400_BAD_REQUEST)

            # Update the 'status' field and save the document
            document.status = DocumentStatus.objects.get(status_name=new_status)
            document.save()

            # Serialize and return the updated document
            serializer = DocumentSerializer(document)
            return Response(serializer.data)
        except Document.DoesNotExist:
            return Response({"error": "Document not found"}, status=status.HTTP_404_NOT_FOUND)

    