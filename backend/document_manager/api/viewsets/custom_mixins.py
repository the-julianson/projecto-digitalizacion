from rest_framework import mixins, viewsets


class ListViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    A viewset that provides `list` actions.

    To use it, override the class and set the `.queryset` and
    `.serializer_class` attributes.
    """


class ListCreateViewset(mixins.CreateModelMixin, ListViewSet):
    """
    A viewset that provides `list` and `create` actions.

    To use it, override the class and set the `.queryset` and
    `.serializer_class` attributes.
    """
