from django.contrib import admin
from apps.events.models import Category, Event, SignUp

admin.site.register(Category)


@admin.register(SignUp)
class SignUpAdmin(admin.ModelAdmin):
    list_display = ("user", "event", "is_attending", "timestamp")
    list_filter = ("is_attending",)
    search_fields = (
        "user__username",
        "user__first_name",
        "user__last_name",
        "event__title",
    )
    raw_id_fields = ("user", "event")


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    search_fields = ["title"]
    list_display = ("title", "organization", "start_time", "is_attendable", "is_hidden")
    list_filter = ("organization__name", "is_attendable", "is_hidden")
    raw_id_fields = ("publisher",)
