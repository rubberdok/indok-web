from django.contrib import admin
from apps.events.models import Category, Event, SignUp


admin.site.register(Category)
admin.site.register(SignUp)


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    search_fields = ["title"]
    list_display = ("title", "organization", "start_time", "is_attendable")
    list_filter = ("organization__name", "is_attendable")