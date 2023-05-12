from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.settings import MAXIMO_ETIQUETAS
from document_manager.api.serializers import EtiquetaSerializer
from document_manager.constants import INVALID_AREA_ID_MSG, NON_POSITIVE_ETIQUETAS_MSG
from document_manager.models import Etiqueta, InternalArea


class EtiquetaViewSet(viewsets.ModelViewSet):
    queryset = Etiqueta.objects.all()
    serializer_class = EtiquetaSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["post"], url_path="create-bulk")
    def create_bulk(self, request, *args, **kwargs):
        area_id = request.data.get("area_id")
        num_etiquetas = request.data.get("number_of_etiquetas")
        user = request.user

        validate_request_data(request.data)
        etiquetas = []
        for _ in range(num_etiquetas):
            etiqueta = Etiqueta(area_id=area_id, user=user)
            etiqueta.save()
            etiquetas.append(etiqueta)

        serializer = self.get_serializer(etiquetas, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


def validate_request_data(data):
    """
    Check that the area_id is valid and the number_of_etiquetas is positive.
    """
    if "area_id" in data:
        if not InternalArea.objects.filter(id=data["area_id"]).exists():
            raise ValidationError(
                detail=f"{INVALID_AREA_ID_MSG} {data['area_id']}",
            )

    if "number_of_etiquetas" in data:
        if not 0 < data["number_of_etiquetas"] <= MAXIMO_ETIQUETAS:
            raise ValidationError(
                detail=f"{NON_POSITIVE_ETIQUETAS_MSG} {MAXIMO_ETIQUETAS}.",
            )
    return data
