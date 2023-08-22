# Generated by Django 4.2 on 2023-07-25 10:52

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("document_manager", "0012_alter_batch_number"),
    ]

    operations = [
        migrations.AlterField(
            model_name="sheet",
            name="batch_id",
            field=models.ForeignKey(
                help_text="ID de lote",
                on_delete=django.db.models.deletion.CASCADE,
                to="document_manager.batch",
            ),
        ),
    ]