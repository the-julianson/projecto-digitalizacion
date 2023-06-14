from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.settings import LABELS_MAX
from document_manager.api.serializers import LabelSerializer
from document_manager.vars import INVALID_AREA_ID_MSG, NON_POSITIVE_LABELS_MSG
from document_manager.models import Label, InternalArea


class LabelViewSet(viewsets.ModelViewSet):
    queryset = Label.objects.all()
    serializer_class = LabelSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["post"], url_path="create-bulk")
    def create_bulk(self, request, *args, **kwargs):
        """
        Create multiple `Label` instances in bulk.

        This endpoint expects the following POST data:
            - `area_id` (int): The ID of the `InternalArea` to associate with the new `Etiqueta` instances.
            - `labels_quantity` (int): The number of `Etiqueta` instances to create.

        The authenticated user is automatically associated with the new `Etiqueta` instances.

        Returns:
            A list of the created `Etiqueta` instances.
        """
        area_id = request.data.get("area_id")
        quantity= request.data.get("labels_quantity")
        user = request.user

        validate_request_data(request.data)
        labels = []
        for _ in range(quantity):
            label = Label(area_id=area_id, user=user)
            label.save()
            labels.append(label)

        serializer = self.get_serializer(labels, many=True)
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

    if "labels_quantity" in data:
        if not 0 < int(data["labels_quantity"]) <= LABELS_MAX:
            raise ValidationError(
                detail=f"{NON_POSITIVE_LABELS_MSG} {LABELS_MAX}.",
            )
    return data
