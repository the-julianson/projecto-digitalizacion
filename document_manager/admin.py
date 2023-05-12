from django.contrib import admin

from document_manager.models import Etiqueta, InternalArea


class EtiquetaAdmin(admin.ModelAdmin):
    list_display = ("codigo", "number", "area", "user", "created_at", "modified_at")
    search_fields = ("codigo", "area__name", "user__username")
    list_filter = ("area", "user", "created_at", "modified_at")


admin.site.register(Etiqueta, EtiquetaAdmin)


@admin.register(InternalArea)
class InternalAreaAdmin(admin.ModelAdmin):
    pass
