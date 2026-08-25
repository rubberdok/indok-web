from django.contrib import admin
from apps.organizations.models import Organization, Membership


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    search_fields = ("name",)


@admin.register(Membership)
class MembershipAdmin(admin.ModelAdmin):
    list_display = ("user", "organization", "group")
    search_fields = (
        "user__username",
        "user__first_name",
        "user__last_name",
        "organization__name",
    )
    raw_id_fields = ("user", "organization")
