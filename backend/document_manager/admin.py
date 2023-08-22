from django.contrib import admin

from document_manager.models import (
    Batch,
    BatchStatus,
    Building,
    Confidentiality,
    Document,
    DocumentLocation,
    DocumentStatus,
    DocumentType,
    InternalArea,
    Label,
    Level,
)


class LabelAdmin(admin.ModelAdmin):
    list_display = ("code", "number", "user", "created_at", "modified_at")
    search_fields = ("code", "user__username")
    list_filter = ("user", "created_at", "modified_at")


admin.site.register(Label, LabelAdmin)


@admin.register(InternalArea)
class InternalAreaAdmin(admin.ModelAdmin):
    pass


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    pass


@admin.register(DocumentLocation)
class DocumentLocationAdmin(admin.ModelAdmin):
    pass


@admin.register(DocumentType)
class DocumentTypeAdmin(admin.ModelAdmin):
    pass


@admin.register(Confidentiality)
class ConfidentialityAdmin(admin.ModelAdmin):
    pass


@admin.register(DocumentStatus)
class StatusAdmin(admin.ModelAdmin):
    pass


@admin.register(Building)
class BuildingAdmin(admin.ModelAdmin):
    pass


@admin.register(Level)
class LevelAdmin(admin.ModelAdmin):
    pass


@admin.register(Batch)
class LevelAdmin(admin.ModelAdmin):
    pass


@admin.register(BatchStatus)
class LevelAdmin(admin.ModelAdmin):
    pass
