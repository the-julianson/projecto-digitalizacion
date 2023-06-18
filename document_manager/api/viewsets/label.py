from django.http import FileResponse
from django.urls import reverse
from pypdf import PdfMerger
from rest_framework import mixins, serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.settings import LABELS_MAX
from document_manager.api.serializers.label import LabelSerializer
from document_manager.constants import INVALID_AREA_ID_MSG, NON_POSITIVE_LABELS_MSG
from document_manager.models import InternalArea, Label
from document_manager.utilities import get_image_response, merge_images


def merge_pdfs(data):
    """
    Merge multiple PDF files into a single PDF file.
    """
    pdf_merger = PdfMerger()
    for etiqueta in data:
        pdf_merger.append(etiqueta.code)
    return pdf_merger


class LabelViewSet(viewsets.ModelViewSet):
    queryset = Label.objects.all()
    serializer_class = LabelSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["post"], url_path="create-bulk")
    def create_bulk(self, request, *args, **kwargs):
        """
        Create multiple `Label` instances in bulk.

        This endpoint expects the following POST data:
            - `area_id` (int): The ID of the `InternalArea` to associate with the new `Label` instances.
            - `labels_quantity` (int): The number of `Label` instances to create.

        The authenticated user is automatically associated with the new `Label` instances.

        Returns:
            A list of the created `Label` instances.
        """
        area_id = request.data.get("area_id")
        labels_quantity = request.data.get("labels_quantity")
        user = request.user

        validate_request_data(request.data)
        labels = []
        for _ in range(labels_quantity):
            label = Label(area_id=area_id, user=user)
            label.save()
            labels.append(label)

        serializer = self.get_serializer(labels, many=True)

        etiqueta_ids_str = ",".join([str(etiqueta["id"]) for etiqueta in serializer.data])
        merged_pdf_url = reverse("label-merge-pdfs") + f"?etiqueta_ids={etiqueta_ids_str}"

        return Response(
            {
                "etiquetas": serializer.data,
                "merged_pdf_url": request.build_absolute_uri(merged_pdf_url),
            },
            status=status.HTTP_201_CREATED,
        )

    @action(detail=False, methods=["get"], url_path="merge-pdfs")
    def merge_pdfs(self, request, *args, **kwargs) -> FileResponse:
        """
        This action generates and serves a merged PDF file containing
        multiple Label PDFs.

        It expects a GET request with a query parameter `etiqueta_ids`,
        which should contain a comma-separated list of Label ids. The view
        will retrieve the corresponding Label objects and merge their associated
        PDF files into a single PDF file. This merged PDF file is then returned
        in the HTTP response.

        Example usage:
            GET /etiquetas/merged-pdf/?etiqueta_ids=1,2,3
        """
        etiqueta_ids_str = request.GET.get("etiqueta_ids")
        etiqueta_ids_list = list(map(int, etiqueta_ids_str.split(",")))
        etiquetas_path_to_code_str = Label.objects.filter(id__in=etiqueta_ids_list).values_list(
            "bar_code_image", flat=True
        )
        merged_image = merge_images(etiquetas_path_to_code_str)

        pdf_bytes = get_image_response(merged_image)
        etiquetas_ids_snake_case = etiqueta_ids_str.replace(",", "_")
        _file_name = f"etiquetas_{etiquetas_ids_snake_case}.png"
        response = FileResponse(pdf_bytes, as_attachment=True, filename=_file_name, content_type="image/png")
        response.headers["Content-Disposition"] = f"attachment; filename={_file_name}"
        return response


def validate_request_data(data):
    """
    Check that the area_id is valid and the number_of_etiquetas is positive.
    """
    if "area_id" in data:
        if not InternalArea.objects.filter(id=data["area_id"]).exists():
            raise ValidationError(
                detail=f"{INVALID_AREA_ID_MSG} {data['area_id']}",
            )

    if "labels_quantity" in data:
        if not 0 < int(data["labels_quantity"]) <= LABELS_MAX:
            raise ValidationError(
                detail=f"{NON_POSITIVE_LABELS_MSG} {LABELS_MAX}.",
            )
    return data


class ListViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    A viewset that provides `list` actions.

    To use it, override the class and set the `.queryset` and
    `.serializer_class` attributes.
    """


class InternalAreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternalArea
        fields = "__all__"


class InternalAreaViewset(ListViewSet):
    queryset = InternalArea.objects.all()
    serializer_class = InternalAreaSerializer


# class DocumentViewSet(ListViewSet):
#     queryset = Documento.objects.all()
#     serializer_class = DocumentoSerializer
#
#
# class DocumentoSerializer(serializers.ModelSerializer):
#
#     class Meta:
#         model = Documento
#         fields = "__all__"
