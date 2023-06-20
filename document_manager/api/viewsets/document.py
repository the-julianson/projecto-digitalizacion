from django_filters import rest_framework as filters
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated

from document_manager.api.filters import DocumentFilter
from document_manager.api.serializers.document import DocumentSerializer
from document_manager.api.viewsets.custom_mixins import ListCreateViewset
from document_manager.models import Document


class DocumentListCreateView(ListCreateViewset):
    queryset = Document.objects.select_related("document_type", "label", "confidentiality", "status").all()
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = DocumentFilter
    pagination_class = PageNumberPagination
