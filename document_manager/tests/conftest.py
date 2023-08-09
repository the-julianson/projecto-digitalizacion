from typing import Callable

import pytest
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractUser
from django.core.management import call_command
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from document_manager.models import (
    Confidentiality,
    DocumentStatus,
    DocumentType,
    InternalArea,
    Label,
)


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user(db):
    user = get_user_model().objects.create_user(
        email="testuser@mail.com", password="testpass"
    )
    return user


@pytest.fixture
def token_factory() -> Callable[[AbstractUser], str]:
    def _token_factory(user: AbstractUser) -> str:
        refresh = RefreshToken.for_user(user)
        return str(refresh.access_token)

    return _token_factory


@pytest.fixture
def token_str(user):
    refresh = RefreshToken.for_user(user)
    return str(refresh.access_token)


@pytest.fixture
def authenticated_api_client(api_client, token_str):
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {token_str}")
    return api_client


@pytest.fixture
def load_internal_areas():
    call_command("loaddata", "internal_areas.json")
    areas_ids = InternalArea.objects.all().values_list("id", flat=True)
    return areas_ids


@pytest.fixture
def load_confidentiality():
    call_command("loaddata", "confidentiality.json")


@pytest.fixture
def load_document_type():
    call_command("loaddata", "document_type.json")


@pytest.fixture
def load_status():
    call_command("loaddata", "status.json")


@pytest.fixture
def load_batch_status():
    call_command("loaddata", "batch_status.json")


@pytest.fixture()
def etiqueta_factory() -> Callable[[AbstractUser], Label]:
    """
    Factory fixture for creating Label instances.

    The fixture returns a function that takes an area_id and a user
    and returns an Label instance with those attributes.

    Args:
        area_id (int): The ID of the area associated with the etiqueta.
        user (User): The user associated with the etiqueta.

    Returns:
        A function that takes an area_id and a user and returns an Label instance.
    """

    def _etiqueta_factory(user: AbstractUser) -> Label:
        return Label.objects.create(user=user)

    return _etiqueta_factory


@pytest.fixture
def status_factory():
    def _status_factory() -> DocumentStatus:
        return DocumentStatus.objects.create(status_name="Test")

    return _status_factory


@pytest.fixture
def kwargs_for_document_factory(
    user, load_internal_areas, load_document_type, load_confidentiality, load_status
):
    confidentiality = Confidentiality.objects.first()
    document_type = DocumentType.objects.first()
    document_status = DocumentStatus.objects.first()

    _kwargs = {
        "document_type": document_type,
        "confidentiality": confidentiality,
        "status": document_status,
    }
    return _kwargs
