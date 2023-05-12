import pytest
from django.core.files.storage import default_storage
from rest_framework import status
from rest_framework.reverse import reverse

from document_manager.constants import INVALID_AREA_ID_MSG, NON_POSITIVE_ETIQUETAS_MSG
from document_manager.models import Etiqueta, InternalArea
from document_manager.tests.utility import delete_file


@pytest.mark.django_db
def test_create_bulk_etiqueta(api_client, token, load_internal_areas):
    area_id = InternalArea.objects.filter(id=2).first().id
    url = reverse("etiqueta-create-bulk")
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    data = {
        "number_of_etiquetas": 2,
        "area_id": area_id,
    }

    response = api_client.post(url, data, format="json")
    assert response.status_code == status.HTTP_201_CREATED

    assert isinstance(response.data, list)
    list_of_ids = [etiqueta["id"] for etiqueta in response.data]
    etiquetas_codes = Etiqueta.objects.filter(id__in=list_of_ids).only("code")

    for etiqueta in etiquetas_codes:
        assert default_storage.exists(etiqueta.code.name)
        delete_file(etiqueta.code.path)


@pytest.mark.django_db
def test_create_bulk_etiqueta_unauthenticated(api_client, token, load_internal_areas):
    area_id = InternalArea.objects.filter(id=2).first().id
    url = reverse("etiqueta-create-bulk")
    data = {
        "number_of_etiquetas": 2,
        "area_id": area_id,
    }
    response = api_client.post(url, data, format="json")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_create_bulk_etiqueta_bad_data(authenticated_api_client, token, load_internal_areas):
    # Invalid area_id
    url = reverse("etiqueta-create-bulk")

    area = InternalArea.objects.filter().last()
    area_id = area.id + 1 if area else 99999
    data = {
        "number_of_etiquetas": 2,
        "area_id": area_id,
    }

    response = authenticated_api_client.post(url, data, format="json")
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert INVALID_AREA_ID_MSG in str(response.data)

    # Non-positive number_of_etiquetas
    data = {
        "number_of_etiquetas": -1,  # non-positive value
        "area_id": InternalArea.objects.first().id,
    }

    response = authenticated_api_client.post(url, data, format="json")
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert NON_POSITIVE_ETIQUETAS_MSG in str(response.data)
