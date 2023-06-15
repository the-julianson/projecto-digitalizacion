from django.http import FileResponse
from django.urls import reverse
from pypdf import PdfMerger
from rest_framework import mixins, serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.settings import MAXIMO_ETIQUETAS
from document_manager.api.serializers import EtiquetaSerializer
from document_manager.constants import INVALID_AREA_ID_MSG, NON_POSITIVE_ETIQUETAS_MSG
from document_manager.models import Etiqueta, InternalArea
from document_manager.utilities import get_image_response, merge_images


def merge_pdfs(data):
    """
    Merge multiple PDF files into a single PDF file.
    """
    pdf_merger = PdfMerger()
    for etiqueta in data:
        pdf_merger.append(etiqueta.code)
    return pdf_merger


class EtiquetaViewSet(viewsets.ModelViewSet):
    queryset = Etiqueta.objects.all()
    serializer_class = EtiquetaSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["post"], url_path="create-bulk")
    def create_bulk(self, request, *args, **kwargs):
        """
        Create multiple `Etiqueta` instances in bulk.

        This endpoint expects the following POST data:
            - `area_id` (int): The ID of the `InternalArea` to associate with the new `Etiqueta` instances.
            - `number_of_etiquetas` (int): The number of `Etiqueta` instances to create.

        The authenticated user is automatically associated with the new `Etiqueta` instances.

        Returns:
            A list of the created `Etiqueta` instances.
        """
        area_id = request.data.get("area_id")
        num_etiquetas = request.data.get("number_of_etiquetas")
        user = request.user

        validate_request_data(request.data)
        etiquetas = []
        for _ in range(num_etiquetas):
            etiqueta = Etiqueta(area_id=area_id, user=user)
            etiqueta.save()  # La etiqueta sea crea en el .save(), no se puede usar bulk_create()
            etiquetas.append(etiqueta)

        serializer = self.get_serializer(etiquetas, many=True)

        etiqueta_ids_str = ",".join([str(etiqueta["id"]) for etiqueta in serializer.data])
        merged_pdf_url = reverse("etiqueta-merge-pdfs") + f"?etiqueta_ids={etiqueta_ids_str}"

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
        multiple Etiqueta PDFs.

        It expects a GET request with a query parameter `etiqueta_ids`,
        which should contain a comma-separated list of Etiqueta ids. The view
        will retrieve the corresponding Etiqueta objects and merge their associated
        PDF files into a single PDF file. This merged PDF file is then returned
        in the HTTP response.

        Example usage:
            GET /etiquetas/merged-pdf/?etiqueta_ids=1,2,3
        """

        etiqueta_ids_str = request.GET.get("etiqueta_ids")
        etiqueta_ids_list = list(map(int, etiqueta_ids_str.split(",")))
        etiquetas_path_to_code_str = Etiqueta.objects.filter(id__in=etiqueta_ids_list).values_list("code", flat=True)
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

    if "number_of_etiquetas" in data:
        if not 0 < data["number_of_etiquetas"] <= MAXIMO_ETIQUETAS:
            raise ValidationError(
                detail=f"{NON_POSITIVE_ETIQUETAS_MSG} {MAXIMO_ETIQUETAS}.",
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


# class DocumentViewSet(viewsets.ModelViewSet):
#     queryset = Documento.objects.all()
#     serializer_class = DocumentoSerializer
#
#
# class DocumentoSerializer(serializers.ModelSerializer):
#
#     class Meta:
#         model = Documento
#         fields = "__all__"
