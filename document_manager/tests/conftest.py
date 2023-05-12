import pytest
from django.contrib.auth import get_user_model
from django.core.management import call_command
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from document_manager.models import InternalArea


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user(db):
    user = get_user_model().objects.create_user(email="testuser@mail.com", password="testpass")
    return user


@pytest.fixture
def token(user):
    refresh = RefreshToken.for_user(user)
    return str(refresh.access_token)


@pytest.fixture
def authenticated_api_client(api_client, token):
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    return api_client


@pytest.fixture()
def load_internal_areas():
    call_command("loaddata", "internal_areas.json")
    areas_ids = InternalArea.objects.all().values_list("id", flat=True)
    return areas_ids
