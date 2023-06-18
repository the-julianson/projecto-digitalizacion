from typing import Callable

import pytest
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractUser
from django.core.management import call_command
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from document_manager.models import (
    Confidentiality,
    DocumentType,
    InternalArea,
    Label,
    Status,
)


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user(db):
    user = get_user_model().objects.create_user(email="testuser@mail.com", password="testpass")
    return user


@pytest.fixture()
def token_factory() -> Callable[[AbstractUser], str]:
    def _token_factory(user: AbstractUser) -> str:
        refresh = RefreshToken.for_user(user)
        return str(refresh.access_token)

    return _token_factory


@pytest.fixtureimmediate
def token_str(user):
    refresh = RefreshToken.for_user(user)
    return str(refresh.access_token)


@pytest.fixture
def authenticated_api_client(api_client, token_str):
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {token_str}")
    return api_client


@pytest.fixture()
def load_internal_areas():
    call_command("loaddata", "internal_areas.json")
    areas_ids = InternalArea.objects.all().values_list("id", flat=True)
    return areas_ids


@pytest.fixture()
def etiqueta_factory() -> Callable[[int, AbstractUser], Label]:
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

    def _etiqueta_factory(area: [int, InternalArea], user: AbstractUser) -> Label:
        return Label.objects.create(area=area, user=user)

    return _etiqueta_factory


@pytest.fixture()
def confidentiality_factory():
    def _confidentiality_factory() -> Confidentiality:
        return Confidentiality.objects.create(level="Test")

    return _confidentiality_factory


@pytest.fixture()
def status_factory():
    def _status_factory() -> Status:
        return Status.objects.create(status_name="Test")

    return _status_factory


@pytest.fixture()
def document_type_factory():
    def _document_type_factory() -> DocumentType:
        return DocumentType.objects.create(type="Test")

    return _document_type_factory
