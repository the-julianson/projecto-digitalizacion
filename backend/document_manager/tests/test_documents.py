import pytest
from django.urls import reverse
from rest_framework import status

from document_manager.factories.document import DocumentFactory
from document_manager.models import (
    Batch,
    BatchStatus,
    Confidentiality,
    DocumentStatus,
    DocumentType,
    Label,
)


@pytest.mark.django_db
def test_document_create_list(
    api_client,
    token_str,
    user,
    etiqueta_factory,
    load_internal_areas,
    load_confidentiality,
    load_document_type,
    load_status,
    load_batch_status,
):
    confidentiality = Confidentiality.objects.first()
    document_type = DocumentType.objects.first()
    document_status = DocumentStatus.objects.first()

    label = etiqueta_factory(user)
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {token_str}")

    batch = Batch.objects.create(user=user, status=BatchStatus.objects.first())

    data = {
        "internal_id": "Test123",
        "label": label.code,
        "blockchain_token": "Test7890",
        "document_description": "Testing Document",
        "batch": batch.id,
        "file_description": "Testing File",
        "document_type": document_type.type,
        "confidentiality": confidentiality.level,
        "status": document_status.name,
        "is_active": True,
    }

    url = reverse("document-list")
    response_post = api_client.post(url, data, format="json")

    assert response_post.status_code == status.HTTP_201_CREATED
    assert response_post.status_code == status.HTTP_201_CREATED

    response_get = api_client.get(url, format="json")

    assert isinstance(response_get.data, dict)
    results = response_get.data.get("results")
    assert len(results) == 1
    assert results[0]["internal_id"] == "Test123"
    assert results[0]["label"] == label.code
    assert results[0]["document_description"] == "Testing Document"
    assert results[0]["document_type"] == document_type.type
    assert results[0]["confidentiality"] == confidentiality.level
    assert results[0]["status"] == document_status.name
    assert results[0]["is_active"] is True


@pytest.mark.django_db
def test_document_list(
    kwargs_for_document_factory,
    api_client,
    token_str,
    user,
    load_batch_status,
):
    number_of_documents_to_create = 10
    documents = []
    batch = Batch.objects.create(user=user, status=BatchStatus.objects.first())
    for _ in range(number_of_documents_to_create):
        label = Label.objects.create(user=user)
        kwargs = {
            **kwargs_for_document_factory,
            "label": label,
            "batch": batch,
        }
        document = DocumentFactory(**kwargs)
        documents.append(document)

    url = reverse("document-list")
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {token_str}")
    response = api_client.get(url, format="json")

    assert response.status_code == status.HTTP_200_OK
    assert isinstance(response.data, dict)
    results = response.data.get("results")
    assert isinstance(results, list)
    assert len(results) == number_of_documents_to_create
    assert results[0]["document_description"] == documents[0].document_description
    assert results[0]["internal_id"] == documents[0].internal_id
    assert results[0]["document_type"] == documents[0].document_type.type
    assert results[0]["confidentiality"] == documents[0].confidentiality.level
    assert results[0]["status"] == documents[0].status.name
    assert results[0]["is_active"] == documents[0].is_active


@pytest.mark.django_db
def test_document_filtering(
    kwargs_for_document_factory,
    api_client,
    token_str,
    user,
    load_batch_status,
):
    document_type1 = DocumentType.objects.create(type="sarasa")
    document_type2 = DocumentType.objects.create(type="patata")

    confidentiality1 = Confidentiality.objects.create(level="Confidentiality1")
    confidentiality2 = Confidentiality.objects.create(level="Confidentiality2")

    batch = Batch.objects.create(user=user, status=BatchStatus.objects.first())

    for document_type, confidentiality in [
        (document_type1, confidentiality1),
        (document_type2, confidentiality2),
    ]:
        label = Label.objects.create(user=user)
        kwargs = {
            **kwargs_for_document_factory,
            "batch": batch,
            "label": label,
            "document_type": document_type,
            "confidentiality": confidentiality,
        }
        DocumentFactory(**kwargs)

    url = reverse("document-list")
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {token_str}")

    response = api_client.get(
        f"{url}?document_type={document_type1.type}", format="json"
    )
    assert response.status_code == status.HTTP_200_OK
    assert isinstance(response.data, dict)
    results = response.data.get("results")
    assert isinstance(results, list)
    assert len(results) == 1
    assert results[0]["document_type"] == document_type1.type


@pytest.mark.django_db
def test_document_creation_with_labels(
    kwargs_for_document_factory,
    api_client,
    token_str,
    user,
    load_batch_status,
):
    data = {
        "internal_id": "Test123",
        "document_description": "A description",
        "labels_quantity": 2,
    }
    url = reverse("document-create-document-and-labels")
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {token_str}")
    response = api_client.post(url, data=data, format="json")
    assert response.status_code == status.HTTP_201_CREATED
    assert isinstance(response.data, dict)
    labels_url = response.data.get("base64_labels_url", None)
    assert labels_url is not None
    labels_response = api_client.get(labels_url, format="json")
    assert labels_response.status_code == status.HTTP_200_OK
    data = labels_response.data
    assert isinstance(data, dict)
    assert len(data.items()) == 2
    first_key = next(iter(data))
    assert isinstance(data.get(first_key), dict)
    assert isinstance(data.get(first_key).get("b64_image"), bytes)
