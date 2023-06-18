import os

import pytest
from PIL import Image
from rest_framework import status


@pytest.mark.django_db
def test_create_confidentiality_level(api_client, token_str):
    url = "/api/confidentiality/"
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {token_str}")
    data = {"level": "Test"}
    response = api_client.post(url, data, format="json")
    assert response.status_code == status.HTTP_201_CREATED
