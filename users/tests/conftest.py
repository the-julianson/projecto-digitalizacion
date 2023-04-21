import pytest
from rest_framework.test import APIClient

from users.models import CustomUser


@pytest.fixture(scope="session")
def api_client():
    return APIClient()


@pytest.fixture(scope="session")
def create_user():
    def _create_user(email: str, password: str, **kwargs):
        return CustomUser.objects.create_user(email, password, **kwargs)

    return _create_user
