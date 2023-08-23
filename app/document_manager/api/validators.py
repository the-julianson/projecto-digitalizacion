from rest_framework.exceptions import ValidationError

from core.settings import LABELS_MAX
from document_manager.constants import NON_POSITIVE_LABELS_MSG


def validate_request_data(data):
    """
    Check that the area_id is valid and the number_of_etiquetas is positive.
    """
    if "labels_quantity" not in data:
        raise ValidationError(
            detail=f"Se tiene que enviar la cantidad de etiquetas a crear.",
        )

    if not 0 < int(data["labels_quantity"]) <= LABELS_MAX:
        raise ValidationError(
            detail=f"{NON_POSITIVE_LABELS_MSG} {LABELS_MAX}.",
        )
