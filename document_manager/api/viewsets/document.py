from rest_framework import generics, viewsets
from rest_framework.permissions import IsAuthenticated

from document_manager.models import Confidentiality, Document, DocumentType, Status

from ..serializers.document import (
    ConfidentialitySerializer,
    DocumentSerializer,
    DocumentTypeSerializer,
    StatusSerializer,
)


class DocumentTypeViewSet(viewsets.ModelViewSet):
    queryset = DocumentType.objects.all()
    serializer_class = DocumentTypeSerializer
    permisiion_class = [
        IsAuthenticated,
    ]


class StatusViewSet(viewsets.ModelViewSet):
    queryset = Status.objects.all()
    serializer_class = StatusSerializer
    permisiion_class = [
        IsAuthenticated,
    ]


class ConfidentialityViewSet(viewsets.ModelViewSet):
    queryset = Confidentiality.objects.all()
    serializer_class = ConfidentialitySerializer
    permisiion_class = [
        IsAuthenticated,
    ]


class DocumentListCreateView(generics.ListCreateAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_class = [
        IsAuthenticated,
    ]
