from django.contrib import admin

from document_manager.models import Label, InternalArea


class LabelAdmin(admin.ModelAdmin):
    list_display = ("code", "number", "area", "user", "created_at", "modified_at")
    search_fields = ("code", "area__name", "user__username")
    list_filter = ("area", "user", "created_at", "modified_at")


admin.site.register(Label, LabelAdmin)


@admin.register(InternalArea)
class InternalAreaAdmin(admin.ModelAdmin):
    pass
