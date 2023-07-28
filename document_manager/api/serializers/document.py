from rest_framework import serializers

from document_manager.models import (
    Confidentiality,
    Document,
    DocumentType,
    Label,
    DocumentStatus,
)


class DocumentSerializer(serializers.ModelSerializer):
    document_type = serializers.SlugRelatedField(many=False, slug_field="type", queryset=DocumentType.objects.all())
    confidentiality = serializers.SlugRelatedField(
        many=False, slug_field="level", queryset=Confidentiality.objects.all()
    )
    status = serializers.SlugRelatedField(many=False, slug_field="status_name", queryset=DocumentStatus.objects.all())
    label = serializers.SlugRelatedField(many=False, slug_field="code", queryset=Label.objects.all())

    class Meta:
        model = Document
        fields = [
            "id",
            "internal_id",
            "file_id",
            "label",
            "blockchain_token",
            "document_description",
            "file_description",
            "document_type",
            "confidentiality",
            "status",
            "is_active",
        ]
        read_only_fields = [
            "id",
        ]
