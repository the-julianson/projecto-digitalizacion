import base64
import json

import pytest
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.reverse import reverse

PASSWORD = "pAsswOrd"


@pytest.mark.django_db
@pytest.mark.parametrize(
    "email, first_name, last_name, password_1, password_2",
    [
        ("a@a.com", "John", "doe", "password", "password"),
        ("b@b.com", "", "", "password", "password"),
    ],
)
def test_user_can_sign_up(group_factory, api_client, email, first_name, last_name, password_1, password_2):
    url = reverse("sign_up")
    group_operator = group_factory(name="operator")
    data = {
        "email": email,
        "password_1": password_1,
        "password_2": password_2,
        "group": [group_operator.name],
    }
    if first_name:
        data["first_name"] = first_name
    if last_name:
        data["last_name"] = last_name
    response = api_client.post(url, data, format="json")

    user = get_user_model().objects.last()

    assert response.status_code == status.HTTP_201_CREATED
    assert response.data["id"] == user.id
    assert response.data["email"] == user.email
    assert group_operator.name in user.groups.values_list("name", flat=True)


@pytest.mark.django_db
@pytest.mark.parametrize(
    "email, password_1, password_2",
    [
        ("", "password", "password"),
        ("b@b.com", "password", "not-matching-password"),
    ],
)
def test_user_missing_data_fails_sign_up(api_client, email, password_1, password_2):
    url = reverse("sign_up")
    data = {
        "password_1": password_1,
        "password_2": password_2,
    }
    response = api_client.post(url, data, format="json")
    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_user_can_log_in(api_client, create_user):
    user = create_user(email="test_user@email.com", password=PASSWORD)

    url = reverse("log_in")
    data = {
        "email": user.email,
        "password": PASSWORD,
    }

    response = api_client.post(url, data=data, format="json")
    access = response.data["access"]

    header, payload, signature = access.split(".")
    decoded_payload = base64.b64decode(f"{payload}==")
    payload_data = json.loads(decoded_payload)

    assert response.status_code == status.HTTP_200_OK
    assert response.data["refresh"] is not None
    assert payload_data["id"] == user.id
    assert payload_data["email"] == user.email
    assert payload_data["first_name"] == user.first_name
    assert payload_data["last_name"] == user.last_name


@pytest.mark.django_db
def test_user_missing_data_fails_log_in(api_client, create_user):
    user = create_user(email="test_user@email.com", password=PASSWORD)

    url = reverse("log_in")
    data = {
        "email": user.email,
        "password": PASSWORD + "giberrish",
    }

    response = api_client.post(url, data=data, format="json")

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_user_can_refresh_token(api_client, create_user):
    user = create_user(email="test_user@email.com", password=PASSWORD)

    log_in_url = reverse("log_in")

    data = {
        "email": user.email,
        "password": PASSWORD,
    }

    response = api_client.post(log_in_url, data=data, format="json")
    refresh_token = response.data["refresh"]
    refresh_url = reverse("token_refresh")
    data_refresh = {"refresh": refresh_token}
    response_refresh = api_client.post(refresh_url, data=data_refresh, format="json")

    assert response_refresh.status_code == status.HTTP_200_OK
    assert response_refresh.data["access"] is not None


@pytest.mark.django_db
def test_wrong_refresh_token(api_client):
    refresh_token = "fictitious-token"
    refresh_url = reverse("token_refresh")
    data_refresh = {"refresh": refresh_token}
    response_refresh = api_client.post(refresh_url, data=data_refresh, format="json")
    assert response_refresh.status_code == status.HTTP_401_UNAUTHORIZED
