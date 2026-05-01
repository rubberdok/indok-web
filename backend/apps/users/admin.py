from django import forms
from django.contrib import admin
from django.contrib.auth.models import Permission
from typing import Optional

from .models import User


class UserAdminForm(forms.ModelForm):
    can_edit_nfc_cards = forms.BooleanField(
        required=False,
        label="Kan redigere NFC-kort (users.manage_user_nfc)",
        help_text=(
            "Styrer direkte bruker-permission for NFC-redigering. "
            "Merk: tilgang kan også komme via gruppe eller staff/superuser."
        ),
    )

    class Meta:
        model = User
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields["user_permissions"].queryset = Permission.objects.order_by("content_type__app_label", "name")

        nfc_permission = Permission.objects.filter(codename="manage_user_nfc", content_type__app_label="users").first()
        self._nfc_permission = nfc_permission

        if self.instance and self.instance.pk and nfc_permission:
            self.fields["can_edit_nfc_cards"].initial = self.instance.user_permissions.filter(pk=nfc_permission.pk).exists()
        else:
            self.fields["can_edit_nfc_cards"].initial = False

    def save(self, commit=True):
        return super().save(commit=commit)


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    form = UserAdminForm
    exclude = ("password",)
    search_fields = ["username", "first_name", "last_name"]
    list_display = ("username", "first_name", "last_name", "last_login")
    filter_horizontal = ("groups", "user_permissions")
    fieldsets = (
        (
            None,
            {
                "fields": (
                    "username",
                    "first_name",
                    "last_name",
                    "email",
                    "feide_email",
                    "feide_userid",
                    "graduation_year",
                    "phone_number",
                    "allergies",
                )
            },
        ),
        (
            "NFC-tilgang",
            {
                "fields": (
                    "can_edit_nfc_cards",
                )
            },
        ),
        (
            "Rettigheter",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        (
            "Systemfelter",
            {
                "fields": (
                    "last_login",
                    "date_joined",
                    "first_login",
                )
            },
        ),
    )

    @staticmethod
    def _get_nfc_permission() -> Optional[Permission]:
        return Permission.objects.filter(codename="manage_user_nfc", content_type__app_label="users").first()

    def save_related(self, request, form, formsets, change):
        super().save_related(request, form, formsets, change)

        nfc_permission = self._get_nfc_permission()
        if nfc_permission is None:
            return

        should_have_direct_perm = form.cleaned_data.get("can_edit_nfc_cards", False)
        user = form.instance
        has_direct_perm = user.user_permissions.filter(pk=nfc_permission.pk).exists()

        if should_have_direct_perm and not has_direct_perm:
            user.user_permissions.add(nfc_permission)
        elif not should_have_direct_perm and has_direct_perm:
            user.user_permissions.remove(nfc_permission)
