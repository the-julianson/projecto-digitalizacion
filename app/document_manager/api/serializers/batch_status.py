from rest_framework import serializers

from document_manager.models import BatchStatus


class BatchStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = BatchStatus
        fields = ["name"]
