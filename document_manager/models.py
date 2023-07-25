import random
from datetime import datetime
from io import BytesIO

import barcode
from barcode.writer import ImageWriter
from django.conf import settings
from django.core.files.base import ContentFile
from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError

class Status(models.Model):
    status_name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.status_name


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


class InternalArea(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class Label(models.Model):
    code = models.CharField(max_length=255, unique=True)
    number = models.IntegerField()
    bar_code_image = models.ImageField(upload_to="images/")
    area = models.ForeignKey(InternalArea, null=True, on_delete=models.SET_NULL)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    created_at = models.DateField(auto_now_add=True)
    modified_at = models.DateField(auto_now=True)

    def __str__(self):
        return self.code

    def generate_bar_code(self):
        now = timezone.now()
        month = now.strftime("%m")
        year = now.strftime("%Y")

        area_id = str(self.area.id) if self.area else "00"
        user_id = str(self.user.id) if self.user else "00"

        self.number = random.randint(10000, 99999)

        self.code = month + year + str(self.number) + area_id + user_id

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
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='%(class)s_deleted_by', null=True, blank=True)

    date = models.DateField(auto_now_add=True, help_text="Fecha del lote")

    # Cada vez que se procesa un documento, se agrega uno nuevo 

    # Hacer un bacthstatus 
    status = models.ForeignKey(Status, on_delete=models.CASCADE)

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
        
        open_batches = Batch.objects.filter(status__status_name='open')
        if self.status.status_name == 'open' and open_batches.exists():
            raise ValidationError("Only one batch with 'open' status is allowed.")
            
        return super().save(*args, **kwargs)        


class Document(models.Model):
    internal_id = models.CharField(max_length=255, null=True, blank=True)
    file_id = models.CharField(max_length=255, null=True, blank=True, help_text="ID de expediente")
    label = models.OneToOneField(Label, on_delete=models.CASCADE)
    batch =  models.ForeignKey(Batch, on_delete=models.CASCADE, help_text="ID de lote")
    blockchain_token = models.CharField(max_length=255, null=True, blank=True)
    document_description = models.CharField(max_length=1000)
    file_description = models.CharField(max_length=1000, null=True, blank=True)
    document_type = models.ForeignKey(DocumentType, on_delete=models.CASCADE)
    confidentiality = models.ForeignKey(Confidentiality, on_delete=models.CASCADE)
    status = models.ForeignKey(Status, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.file_id}: {self.document_description}"


class Sheet(models.Model):
    """Represents 'Fojas'."""

    batch_id = models.ForeignKey(Batch, on_delete=models.CASCADE, help_text="ID de lote")
    intern_id = models.IntegerField(help_text="ID propio si lo tiene")
    image = models.TextField()
    data = models.JSONField()
    document = models.ForeignKey(Document, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.id} - {self.document}"


class DocumentLocation(models.Model):
    building = models.ForeignKey(Building, on_delete=models.CASCADE)
    level = models.ForeignKey(Level, on_delete=models.CASCADE)
    init_date = models.DateField(default=datetime.now, help_text="Fecha en la que ingresa el documento")
    out_date = models.DateField(null=True, help_text="Fecha en la que se retira el documento")
    box_id = models.IntegerField(null=True, help_text="ID caja que contiene el documento")

    def __str__(self):
        return f"{self.building} - {self.level}"


