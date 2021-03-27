from django.contrib import admin
from .models import User

# Register your models here.
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    exclude = ("password",)
    search_fields = ["username", "first_name", "last_name"]
