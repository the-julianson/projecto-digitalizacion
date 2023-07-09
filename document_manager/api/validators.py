from rest_framework.exceptions import ValidationError

from core.settings import LABELS_MAX
from document_manager.constants import INVALID_AREA_ID_MSG, NON_POSITIVE_LABELS_MSG
from document_manager.models import InternalArea


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
