from rest_framework import serializers

from document_manager.models import (
    Confidentiality,
    Document,
    DocumentStatus,
    DocumentType,
    Label,
)


class DocumentSerializer(serializers.ModelSerializer):
    document_type = serializers.SlugRelatedField(
        many=False, slug_field="type", queryset=DocumentType.objects.all()
    )
    confidentiality = serializers.SlugRelatedField(
        many=False, slug_field="level", queryset=Confidentiality.objects.all()
    )
    status = serializers.SlugRelatedField(
        many=False, slug_field="name", queryset=DocumentStatus.objects.all()
    )
    label = serializers.SlugRelatedField(
        many=False, slug_field="code", queryset=Label.objects.all()
    )

    class Meta:
        model = Document
        fields = [
            "id",
            "internal_id",
            "label",
            "document_description",
            "document_type",
            "confidentiality",
            "document_description",
            "status",
            "is_active",
            "batch",
        ]
        read_only_fields = [
            "id",
        ]
