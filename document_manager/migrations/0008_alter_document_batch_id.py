# Generated by Django 4.2 on 2023-07-21 16:06

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("document_manager", "0007_document_batch_id"),
    ]

    operations = [
        migrations.AlterField(
            model_name="document",
            name="batch_id",
            field=models.IntegerField(help_text="ID de Lote"),
        ),
    ]
