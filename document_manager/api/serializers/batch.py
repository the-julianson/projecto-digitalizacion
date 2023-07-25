from rest_framework import serializers

from document_manager.models import Batch

class BatchSerializer(serializers.ModelSerializer): 
      class Meta:
        model = Batch
        fields = "__all__"
      
