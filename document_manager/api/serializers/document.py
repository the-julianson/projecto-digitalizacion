from rest_framework import serializers

from document_manager.models import (
    Confidentiality,
    Document,
    DocumentType,
    Label,
    Status,
)

from .label import LabelSerializer


class DocumentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentType
        fields = "__all__"
        read_only_fields = [
            "id",
        ]


class ConfidentialitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Confidentiality
        fields = "__all__"
        read_only_fields = [
            "id",
        ]


class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = "__all__"
        read_only_fields = [
            "id",
        ]


class DocumentSerializer(serializers.ModelSerializer):
    document_type = serializers.SlugRelatedField(many=False, slug_field="type", queryset=DocumentType.objects.all())
    confidentiality = serializers.SlugRelatedField(
        many=False, slug_field="level", queryset=Confidentiality.objects.all()
    )
    status = serializers.SlugRelatedField(many=False, slug_field="status_name", queryset=Status.objects.all())
    label = serializers.SlugRelatedField(many=False, slug_field="code", queryset=Label.objects.all())

    class Meta:
        model = Document
        fields = "__all__"
        read_only_fields = [
            "id",
        ]
