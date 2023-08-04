from rest_framework import serializers

from document_manager.models import DocumentStatus

class DocumentStatusSerializer(serializers.ModelSerializer): 
      class Meta:
        model = DocumentStatus
        fields = ["name"]