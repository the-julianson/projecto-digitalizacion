# Importo todo lo que necesito 
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from document_manager.models import Batch, Status
from rest_framework import status
from django.shortcuts import get_object_or_404

# Serializador de lote 
from document_manager.api.serializers.batch import BatchSerializer

# Para crear el viewset
from rest_framework import viewsets

# Acá iría el modelo del lote. 
from document_manager.models import Document

class BatchViewSet(viewsets.ModelViewSet):

    # Crear todo el viewSet de Batch 

    queryset = Batch.objects.all()
    serializer_class = BatchSerializer
    permission_classes = [IsAuthenticated] 

    @action(detail=False, methods=['put'], url_path="close-batch/(?P<batch_number>[0-9]+)")
    def close_batch(self, request, batch_number=None):
        if batch_number is None:
            return Response(
                {"error": "Please provide the 'batch_number' in the URL."},
                status=status.HTTP_400_BAD_REQUEST
            )

        batch = get_object_or_404(Batch, number=batch_number)

        # Esto es un hardcode de la puta madre 
        if batch.status.status_name != 'open':
            return Response(
                {"error": "The batch must have 'open' status to be closed."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if all associated documents have 'scanned' status
        # Ahora si funciona 
        documents = batch.document_set.all()
        if not all(document.status.status_name == 'scanned' for document in documents):
            return Response(
                {"error": "All associated documents must have 'scanned' status."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Perform the logic to close the batch (e.g., change status to 'closed')
        batch.status = Status.objects.get(status_name='closed')
        batch.save()

        serializer = BatchSerializer(batch)
        return Response(serializer.data)

