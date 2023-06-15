import random
from io import BytesIO

import barcode
from barcode.writer import ImageWriter
from django.conf import settings
from django.core.files.base import ContentFile
from django.db import models
from django.utils import timezone


class Estado(models.Model):
    nombre_estado = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.nombre_estado


class TipoDeDocumento(models.Model):
    tipo = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.tipo


class Confidentiality(models.Model):
    nivel = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.nivel


class Edificio(models.Model):
    nombre = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.nombre


class Nivel(models.Model):
    nombre = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.nombre


class InternalArea(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class Etiqueta(models.Model):
    codigo = models.CharField(max_length=255, unique=True)
    number = models.IntegerField()
    code = models.ImageField(upload_to="images/")
    area = models.ForeignKey(InternalArea, null=True, on_delete=models.SET_NULL)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    created_at = models.DateField(auto_now_add=True)
    modified_at = models.DateField(auto_now=True)

    def __str__(self):
        return self.codigo

    def generate_code(self):
        now = timezone.now()
        month = now.strftime("%m")
        year = now.strftime("%Y")

        area_id = str(self.area.id) if self.area else "00"
        user_id = str(self.user.id) if self.user else "00"

        self.number = random.randint(10000, 99999)

        self.codigo = month + year + str(self.number) + area_id + user_id

        #: generate image and save it to self.barcode
        code_128_class = barcode.get_barcode_class("Code128")
        code_128 = code_128_class(self.codigo, writer=ImageWriter())
        buffer = BytesIO()
        code_128.write(buffer)

        file_name = f"{self.codigo}.png"
        file_content = ContentFile(buffer.getvalue())
        self.code.save(file_name, file_content, save=False)

    def save(self, *args, **kwargs):
        self.generate_code()
        super().save(*args, **kwargs)


class Documento(models.Model):
    id_interno = models.CharField(max_length=255, null=True, blank=True)
    id_expediente = models.CharField(max_length=255, null=True, blank=True)
    etiqueta = models.OneToOneField(Etiqueta, on_delete=models.CASCADE)
    blockchain_token = models.CharField(max_length=255, null=True, blank=True)
    descripcion_documento = models.CharField(max_length=1000)
    descripcion_expediente = models.CharField(max_length=1000, null=True, blank=True)
    tipo_documento = models.ForeignKey(TipoDeDocumento, on_delete=models.CASCADE)
    confidencialidad = models.ForeignKey(Confidentiality, on_delete=models.CASCADE)
    estado = models.ForeignKey(Estado, on_delete=models.CASCADE)
    created_at = models.DateTimeField()
    modified_at = models.DateTimeField()
    esta_activo = models.BooleanField(default=True)

    def __str__(self):
        return self.descripcion_documento


class Foja(models.Model):
    id_lote = models.IntegerField()
    id_interno = models.IntegerField()
    imagen = models.TextField()
    data = models.JSONField()
    documento = models.ForeignKey(Documento, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.id_interno} - {self.documento}"


class DocumentLocation(models.Model):
    edificio = models.ForeignKey(Edificio, on_delete=models.CASCADE)
    nivel = models.ForeignKey(Nivel, on_delete=models.CASCADE)
    fecha_inicio = models.DateField()
    fecha_salida = models.DateField()
    id_caja = models.IntegerField()

    def __str__(self):
        return f"{self.edificio} - {self.nivel}"
