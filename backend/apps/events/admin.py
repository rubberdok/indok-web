from django.contrib import admin
from apps.events.models import Category, Event, SignUp, AttendableEvent


admin.site.register(Category)
admin.site.register(SignUp)


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    search_fields = ["title"]
    list_display = ("title", "organization", "start_time")
    list_filter = ("organization__name",)


@admin.register(AttendableEvent)
class EventAdmin(admin.ModelAdmin):
    search_fields = ["title"]
    list_display = ("title", "organization", "start_time", "available_slots")
    list_filter = ("organization__name",)
