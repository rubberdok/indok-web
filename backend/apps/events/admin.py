from django.contrib import admin
from apps.events.models import Category, Event, SignUp, Attendable, SlotDistribution


admin.site.register(Category)
admin.site.register(SignUp)
admin.site.register(Attendable)
admin.site.register(SlotDistribution)


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    search_fields = ["title"]
    list_display = ("title", "organization", "start_time")
    list_filter = ("organization__name",)
