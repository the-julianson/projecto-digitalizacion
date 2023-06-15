from typing import Callable

import pytest
from django.contrib.auth.models import Group
from rest_framework.test import APIClient

from users.models import CustomUser


@pytest.fixture(scope="session")
def api_client():
    return APIClient()


@pytest.fixture(scope="session")
def create_user() -> Callable[..., CustomUser]:
    """
    A Pytest fixture that creates a CustomUser object in the database.
    """

    def _create_user(email: str, password: str, **kwargs) -> CustomUser:
        user = CustomUser.objects.create_user(email, password, **kwargs)
        return user

    return _create_user


@pytest.fixture
def setup_groups(db):
    group_names = ["operator", "manager"]
    groups = [Group(name=name) for name in group_names]
    Group.objects.bulk_create(groups)


@pytest.fixture
def group_factory(db) -> Callable[..., Group]:
    """
    A Pytest fixture that creates a Group object in the database.

    Args:
        db: Database fixture (assumed to be set up in the test environment).

    Returns:
        A factory function (_group_factory) that can be used to create Group objects.

    Example usage:
        group = group_factory('Group Name', attribute1='value1', attribute2='value2')
    """

    def _group_factory(name: str, **kwargs):
        """
        Factory function that creates a Group object.

        Args:
            name: Name of the group.
            **kwargs: Additional keyword arguments to set as attributes for the Group object.

        Returns:
            The created Group object.

        Example usage:
            group = _group_factory('Group Name', attribute1='value1', attribute2='value2')
        """
        group = Group.objects.create(name=name, **kwargs)
        return group

    return _group_factory
