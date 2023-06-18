import pytest
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status

from ..models import Document, InternalArea


@pytest.mark.django_db
def test_document_create_list(
    api_client,
    token_str,
    document_type_factory,
    confidentiality_factory,
    status_factory,
    user,
    etiqueta_factory,
    load_internal_areas,
):
    area = InternalArea.objects.filter(id=2).first()
    User = get_user_model()
    user = User.objects.create_user(email="normal@user.com", password="foo")
    label = etiqueta_factory(area, user)
    document_type = document_type_factory()
    confidentiality = confidentiality_factory()
    document_status = status_factory()
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {token_str}")

    data = {
        "internal_id": "Test123",
        "file_id": "Test456",
        "label": label.code,
        "blockchain_token": "Test7890",
        "document_description": "Testing Document",
        "file_description": "Testing File",
        "document_type": document_type.type,
        "confidentiality": confidentiality.level,
        "status": document_status.status_name,
        "is_active": True,
    }

    url = "/api/documents/"
    response_post = api_client.post(url, data, format="json")

    assert response_post.status_code == status.HTTP_201_CREATED

    response_get = api_client.get(url, format="json")

    assert response_post.status_code == status.HTTP_201_CREATED
    assert len(response_get.data) == 1


@pytest.mark.django_db
def test_document_list(api_client, token_str):
    pass
