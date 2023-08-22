from django_filters import rest_framework as filters

from document_manager.models import Document


class DocumentFilter(filters.FilterSet):
    """
    Filter for DocumentViewSet
    Allows filtering by:
    - `document_type` (int): The document type.
    - `confidentiality` (str): The document number.
    """

    document_type = filters.CharFilter(
        field_name="document_type__type", lookup_expr="icontains"
    )
    confidentiality = filters.CharFilter(
        field_name="confidentiality__level", lookup_expr="icontains"
    )

    class Meta:
        model = Document
        fields = []
