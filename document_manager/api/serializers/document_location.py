from rest_framework import serializers

from document_manager.models import DocumentLocation


class DocumentoLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentLocation
        fields = ["id"]
