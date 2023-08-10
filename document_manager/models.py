import random
from datetime import datetime
from io import BytesIO

import barcode
from barcode.writer import ImageWriter
from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ValidationError
from django.core.files.base import ContentFile
from django.db import models
from django.utils import timezone


class BaseModel(models.Model):
    """Clase que registra fecha alta, baja, modificacion, usuario alta, baja, modificacion"""

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='%(class)s_created_by',
        null=True,
        blank=True,
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='%(class)s_updated_by',
        null=True,
        blank=True,
    )
    deleted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='%(class)s_deleted_by',
        null=True,
        blank=True,
    )

    class Meta:
        abstract = True


class NamedModel(models.Model):
    value = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.value

    class Meta:
        abstract = True


class DocumentStatus(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class BatchStatus(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class DocumentType(models.Model):
    type = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.type


class Confidentiality(models.Model):
    level = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.level


class Building(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class Level(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class Room(NamedModel):
    level = models.ForeignKey(Level, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.value} in {self.level}"


class Shelf(NamedModel):
    room = models.ForeignKey(Room, related_name="shelves", on_delete=models.CASCADE)

    def __str__(self):
        return f"Shelf {self.value} in {self.room.value}"


class Box(NamedModel):
    shelf = models.ForeignKey(Shelf, related_name="boxes", on_delete=models.CASCADE)
    init_date = models.DateField(
        default=datetime.now, help_text="Fecha en la que ingresa el documento"
    )
    out_date = models.DateField(
        null=True, help_text="Fecha en la que se retira el documento"
    )
    # box_id = models.IntegerField(null=True,
    #                              help_text="ID caja que contiene el documento")

    def __str__(self):
        return f"Box {self.value} in {self.shelf.value}"


class InternalArea(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class Label(models.Model):
    code = models.CharField(max_length=255, unique=True)
    number = models.IntegerField()
    bar_code_image = models.ImageField(upload_to="images/")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    created_at = models.DateField(auto_now_add=True)
    modified_at = models.DateField(auto_now=True)

    def __str__(self):
        return self.code

    def generate_bar_code(self):
        now = timezone.now()
        month = now.strftime("%m")
        year = now.strftime("%Y")

        user_id = str(self.user_id) if self.user else "00"

        self.number = random.randint(10000, 99999)

        self.code = month + year + str(self.number) + user_id

        #: generate image and save it to self.barcode
        code_128_class = barcode.get_barcode_class("Code128")
        code_128 = code_128_class(self.code, writer=ImageWriter())
        buffer = BytesIO()
        code_128.write(buffer)

        file_name = f"{self.code}.png"
        file_content = ContentFile(buffer.getvalue())
        self.bar_code_image.save(file_name, file_content, save=False)

    def save(self, *args, **kwargs):
        self.generate_bar_code()
        super().save(*args, **kwargs)


class Batch(models.Model):
    # No sé si se crea de esta forma el id interno o se obviaba

    number = models.IntegerField(unique=True, blank=True)

    # No sé si user id o operador id (Es una FK ?) ¿Hay que importar los modelos de User ?
    # user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='%(class)s_deleted_by',
        null=True,
        blank=True,
    )

    date = models.DateField(auto_now_add=True, help_text="Fecha del lote")

    # Cada vez que se procesa un documento, se agrega uno nuevo

    # Hacer un bacthstatus
    status = models.ForeignKey(BatchStatus, on_delete=models.PROTECT)

    def __str__(self):
        return f"{self.number}"

    def save(self, *args, **kwargs):
        if not self.pk:
            # Generate a sequential number when the instance is being saved for the first time
            last_instance = Batch.objects.order_by('-number').first()
            if last_instance:
                self.number = last_instance.number + 1
            else:
                self.number = 1

        open_batches = Batch.objects.filter(status__name='abierto')
        if self.status.name == 'abierto' and open_batches.exists():
            raise ValidationError("Only one batch with 'open' status is allowed.")

        return super().save(*args, **kwargs)


class Document(models.Model):
    internal_id = models.CharField(
        db_index=True,
        max_length=255,
        null=True,
        blank=True,
        help_text="Numero de Expediente",
    )
    label = models.OneToOneField(
        Label, models.PROTECT, null=True, blank=True, help_text="Etiqueta"
    )
    document_description = models.CharField(
        max_length=1000, default="", help_text="Descripcion del Documento"
    )
    document_type = models.ForeignKey(
        DocumentType,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        help_text="Tipo de Documento",
    )
    confidentiality = models.ForeignKey(
        Confidentiality,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        help_text="Nivel de Confidencialidad",
    )
    internal_area = models.ForeignKey(
        InternalArea, null=True, on_delete=models.PROTECT, help_text="Area Interna"
    )
    batch = models.ForeignKey(Batch, on_delete=models.PROTECT, help_text="ID de Lote")
    status = models.ForeignKey(
        DocumentStatus,
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        help_text="Estado del Documento",
    )
    # A document can be in only one location at a time
    box = models.ForeignKey(
        Box, on_delete=models.PROTECT, null=True, blank=True, help_text="Caja"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.internal_id}: {self.document_description}"


class DocumentStatusHistory(models.Model):
    """Representa el historial de estados de un documento.
    Cada vez que se hace una modificacion al estado de un documento se crea un registro en esta tabla.
    """

    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    status = models.ForeignKey(DocumentStatus, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)

    def __str__(self):
        return f"{self.document}: {self.status}"


class Page(models.Model):
    """Represent una hoja de Documento."""

    image = models.TextField(help_text="Imagen escaneada en base64")
    data = models.JSONField(help_text="Contenido Bruto de la digitalizacion")
    document = models.ForeignKey(
        Document, on_delete=models.CASCADE, help_text="Documento al que pertenece"
    )
    label = models.OneToOneField(
        Label, on_delete=models.CASCADE, help_text="Etiqueta de la Foja"
    )

    def __str__(self):
        return f"{self.label.code} - {self.document}"


class DocumentLocation(models.Model):
    building = models.ForeignKey(Building, on_delete=models.CASCADE)
    level = models.ForeignKey(Level, on_delete=models.CASCADE)
    init_date = models.DateField(
        default=datetime.now, help_text="Fecha en la que ingresa el documento"
    )
    out_date = models.DateField(
        null=True, help_text="Fecha en la que se retira el documento"
    )
    box_id = models.IntegerField(
        null=True, help_text="ID caja que contiene el documento"
    )

    def __str__(self):
        return f"{self.building} - {self.level}"
