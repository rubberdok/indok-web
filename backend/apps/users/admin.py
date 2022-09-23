from django.contrib import admin
from apps.users.models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    search_fields = ["username", "first_name", "last_name"]
    list_display = ("username", "first_name", "last_name", "last_login")
