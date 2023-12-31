from django.urls import reverse
from django_filters import rest_framework as filters
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from document_manager.api.filters import DocumentFilter
from document_manager.api.serializers.document import DocumentSerializer
from document_manager.api.validators import validate_request_data
from document_manager.api.viewsets.custom_mixins import ListCreateViewset
from document_manager.models import Batch, BatchStatus, Document, DocumentStatus, Label
from document_manager.utilities import json_loads


class DocumentListCreateView(ListCreateViewset):
    queryset = Document.objects.select_related(
        "document_type", "label", "confidentiality", "status"
    ).all()
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = DocumentFilter
    pagination_class = PageNumberPagination

    @action(detail=False, methods=['get'], url_path='get-documents-last-batch')
    def documents_by_batch_id(self, request):
        """
        Custom action to retrieve documents associated with all batches where the status is 'open'.
        """
        try:
            open_batches = Batch.objects.filter(status__name='abierto')
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
            new_status = None
        except Document.DoesNotExist:
            return Response(
                {"error": "Document not found"}, status=status.HTTP_404_NOT_FOUND
            )

        new_status = json_loads(request)

        if new_status is None:
            new_status = request.data.get('status')

        valid_statuses = DocumentStatus.objects.values_list("name", flat=True)
        if new_status not in valid_statuses:
            return Response(
                {"error": "Invalid status provided"}, status=status.HTTP_400_BAD_REQUEST
            )

        document.status = DocumentStatus.objects.get(name=new_status)
        document.save()
        serializer = DocumentSerializer(document)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='create-document-and-labels')
    def create_document_and_labels(self, request):
        """
        Custom action to create a new document and associate it with a batch that
        has status 'open'. The batch number should be programatically found from the database
        and not provided by the user.
        The number of labels to create should be provided by the user and create them programatically.
        """

        open_batch = Batch.objects.filter(status__name='abierto').last()
        if not open_batch:
            open_batch = Batch.objects.create(
                status=BatchStatus.objects.get(name='abierto')
            )
        user = request.user
        document_label = Label.objects.create(user=user)

        labels_quantity = request.data.get('labels_quantity')

        validate_request_data(request.data)
        labels = []
        for _ in range(labels_quantity):
            label = Label(user=user)
            label.save()
            labels.append(label)

        labels_id_str = ",".join([str(label.id) for label in labels])
        base64_bulk_image_url = (
            reverse("label-create-base64-labels") + "?labels_ids=" + labels_id_str
        )

        document = Document.objects.create(
            internal_id=request.data.get('internal_id'),
            label=document_label,
            document_description=request.data.get('document_description'),
            batch=open_batch,
        )
        serializer = DocumentSerializer(document)
        return Response(
            {
                "document": serializer.data,
                "base64_labels_url": request.build_absolute_uri(base64_bulk_image_url),
            },
            status=status.HTTP_201_CREATED,
        )
