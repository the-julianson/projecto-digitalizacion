import os

import pytest
from django.core.files.storage import default_storage
from PIL import Image
from rest_framework import status
from rest_framework.reverse import reverse

from document_manager.constants import NON_POSITIVE_LABELS_MSG
from document_manager.models import InternalArea, Label
from document_manager.tests.utility import delete_file
from document_manager.utilities import merge_images


@pytest.mark.django_db
def test_create_bulk_etiqueta(api_client, token_str, load_internal_areas):
    area_id = InternalArea.objects.filter(id=2).first().id
    url = reverse("label-create-bulk")
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {token_str}")
    data = {
        "labels_quantity": 2,
        "area_id": area_id,
    }
    response = api_client.post(url, data, format="json")
    assert response.status_code == status.HTTP_201_CREATED
    assert isinstance(response.data, dict)
    list_of_ids = [etiqueta["id"] for etiqueta in response.data["etiquetas"]]
    etiquetas_codes = Label.objects.filter(id__in=list_of_ids).only("bar_code_image")

    for etiqueta in etiquetas_codes:
        assert default_storage.exists(etiqueta.bar_code_image.name)
        delete_file(etiqueta.bar_code_image.path)
    assert response.data["merged_pdf_url"] is not None
    merged_pdf_url_substring = (
        reverse("label-merge-pdfs") + f"?etiqueta_ids={','.join(map(str, list_of_ids))}"
    )
    assert merged_pdf_url_substring in response.data["merged_pdf_url"]


@pytest.mark.django_db
def test_create_bulk_etiqueta_unauthenticated(
    api_client, token_str, load_internal_areas
):
    area_id = InternalArea.objects.filter(id=2).first().id
    url = reverse("label-create-bulk")
    data = {
        "number_of_etiquetas": 2,
        "area_id": area_id,
    }
    response = api_client.post(url, data, format="json")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_create_bulk_etiqueta_bad_data(
    authenticated_api_client, token_str, load_internal_areas
):
    url = reverse("label-create-bulk")
    data = {
        "labels_quantity": -1,
        "area_id": InternalArea.objects.first().id,
    }
    response = authenticated_api_client.post(url, data, format="json")
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert NON_POSITIVE_LABELS_MSG in str(response.data)


@pytest.mark.django_db
def test_merged_pdf_url(
    api_client, user, token_factory, load_internal_areas, etiqueta_factory
):
    url = reverse("label-merge-pdfs")
    token_str = token_factory(user)

    numero_etiquetas = 10

    etiquetas_id = []
    for _ in range(numero_etiquetas):
        etiqueta = etiqueta_factory(user)
        etiquetas_id.append(etiqueta.id)

    etiquetas_id_str = ",".join(map(str, etiquetas_id))
    url = url + f"?etiqueta_ids={etiquetas_id_str}"

    response = api_client.get(url, HTTP_AUTHORIZATION=f"Bearer {token_str}")
    etiquetas_ids_snake_case = etiquetas_id_str.replace(",", "_")
    assert response.status_code == status.HTTP_200_OK
    assert (
        response["Content-Disposition"]
        == f"attachment; filename=etiquetas_{etiquetas_ids_snake_case}.png"
    )


@pytest.mark.django_db
def test_merge_images(etiqueta_factory, user, load_internal_areas):
    etiqueta_path_strings = []
    etiquetas = []
    for _ in range(3):
        etiqueta = etiqueta_factory(user)
        etiqueta_path_strings.append(etiqueta.bar_code_image)
        etiquetas.append(etiqueta)

    merged_images = merge_images(etiqueta_path_strings)
    assert merged_images is not None
    assert isinstance(merged_images, Image.Image)
    for etiqueta in etiquetas:
        is_file = os.path.isfile(etiqueta.bar_code_image.path)
        assert is_file is True
        if is_file:
            os.remove(etiqueta.bar_code_image.path)
