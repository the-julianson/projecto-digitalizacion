# Generated by Django 4.2 on 2023-08-04 08:18

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("document_manager", "0015_rename_status_documentstatus"),
    ]

    operations = [
        migrations.RenameField(
            model_name="batchstatus",
            old_name="batch_status_name",
            new_name="name",
        ),
        migrations.RenameField(
            model_name="documentstatus",
            old_name="status_name",
            new_name="name",
        ),
        migrations.AlterField(
            model_name="document",
            name="status",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                to="document_manager.documentstatus",
            ),
        ),
    ]
