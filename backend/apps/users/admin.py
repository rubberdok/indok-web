from django import forms
from django.contrib import admin
from django.contrib.auth.models import Permission
from typing import Optional

from .models import User


class UserAdminForm(forms.ModelForm):
    can_edit_nfc_cards = forms.BooleanField(
        required=False,
        label="Kan redigere NFC-kort",
        help_text="users.manage_user_nfc",
    )
    can_view_sensitive_info = forms.BooleanField(
        required=False,
        label="Kan se sensitiv informasjon",
        help_text="users.view_sensitive_info",
    )
    can_manage_user_profiles = forms.BooleanField(
        required=False,
        label="Kan redigere andre brukeres profiler",
        help_text="users.manage_user_profiles",
    )
    can_manage_janhus_booking = forms.BooleanField(
        required=False,
        label="Kan administrere JanHus booking",
        help_text="janhus.manage_booking",
    )
    can_manage_janhus_settings = forms.BooleanField(
        required=False,
        label="Kan administrere JanHus innstillinger",
        help_text="janhus.manage_settings",
    )
    can_manage_cabins_booking = forms.BooleanField(
        required=False,
        label="Kan administrere hyttebooking",
        help_text="cabins.manage_booking + cabins.change_cabin",
    )
    can_manage_cabins_settings = forms.BooleanField(
        required=False,
        label="Kan administrere hyttebooking innstillinger",
        help_text="cabins.change_bookingsemester",
    )
    can_archive_documents = forms.BooleanField(
        required=False,
        label="Kan arkivere dokumenter",
        help_text=(
            "archive.add_archivedocument + archive.change_archivedocument + "
            "archive.delete_archivedocument + archive.view_archivedocument"
        ),
    )
    is_indok_norwegian = forms.BooleanField(
        required=False,
        label="Er Indøk student",
        help_text="Viser users.is_indok, kan endres",
    )

    class Meta:
        model = User
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields["user_permissions"].queryset = Permission.objects.order_by(
            "content_type__app_label", "name"
        )

        nfc_permission = Permission.objects.filter(
            codename="manage_user_nfc", content_type__app_label="users"
        ).first()
        self._nfc_permission = nfc_permission

        if self.instance and self.instance.pk and nfc_permission:
            self.fields["can_edit_nfc_cards"].initial = (
                self.instance.user_permissions.filter(pk=nfc_permission.pk).exists()
            )
        else:
            self.fields["can_edit_nfc_cards"].initial = False

        view_info = Permission.objects.filter(
            codename="view_sensitive_info", content_type__app_label="users"
        ).first()
        self._view_info_permission = view_info

        if self.instance and self.instance.pk and view_info:
            self.fields["can_view_sensitive_info"].initial = (
                self.instance.user_permissions.filter(pk=view_info.pk).exists()
            )
        else:
            self.fields["can_view_sensitive_info"].initial = False

        manage_profiles = Permission.objects.filter(
            codename="manage_user_profiles", content_type__app_label="users"
        ).first()
        self._manage_profiles_permission = manage_profiles

        if self.instance and self.instance.pk and manage_profiles:
            self.fields["can_manage_user_profiles"].initial = (
                self.instance.user_permissions.filter(pk=manage_profiles.pk).exists()
            )
        else:
            self.fields["can_manage_user_profiles"].initial = False

        manage_janhus_booking = Permission.objects.filter(
            codename="manage_booking", content_type__app_label="janhus"
        ).first()

        if self.instance and self.instance.pk and manage_janhus_booking:
            self.fields["can_manage_janhus_booking"].initial = (
                self.instance.user_permissions.filter(
                    pk=manage_janhus_booking.pk
                ).exists()
            )
        else:
            self.fields["can_manage_janhus_booking"].initial = False

        manage_janhus_settings = Permission.objects.filter(
            codename="manage_settings", content_type__app_label="janhus"
        ).first()
        self._manage_settings_permission = manage_janhus_settings

        if self.instance and self.instance.pk and manage_janhus_settings:
            self.fields["can_manage_janhus_settings"].initial = (
                self.instance.user_permissions.filter(
                    pk=manage_janhus_settings.pk
                ).exists()
            )
        else:
            self.fields["can_manage_janhus_settings"].initial = False

        manage_cabins_booking = Permission.objects.filter(
            codename="manage_booking", content_type__app_label="cabins"
        ).first()
        change_cabin_permission = Permission.objects.filter(
            codename="change_cabin", content_type__app_label="cabins"
        ).first()

        if (
            self.instance
            and self.instance.pk
            and manage_cabins_booking
            and change_cabin_permission
        ):
            has_manage_booking = self.instance.user_permissions.filter(
                pk=manage_cabins_booking.pk
            ).exists()
            has_change_cabin = self.instance.user_permissions.filter(
                pk=change_cabin_permission.pk
            ).exists()
            self.fields["can_manage_cabins_booking"].initial = (
                has_manage_booking and has_change_cabin
            )
        else:
            self.fields["can_manage_cabins_booking"].initial = False

        manage_cabins_settings = Permission.objects.filter(
            codename="change_bookingsemester", content_type__app_label="cabins"
        ).first()
        self._manage_cabins_settings_permission = manage_cabins_settings

        if self.instance and self.instance.pk and manage_cabins_settings:
            self.fields["can_manage_cabins_settings"].initial = (
                self.instance.user_permissions.filter(
                    pk=manage_cabins_settings.pk
                ).exists()
            )
        else:
            self.fields["can_manage_cabins_settings"].initial = False

        archive_permissions = list(
            Permission.objects.filter(
                content_type__app_label="archive",
                codename__in=[
                    "add_archivedocument",
                    "change_archivedocument",
                    "delete_archivedocument",
                    "view_archivedocument",
                ],
            )
        )
        self._archive_permissions = archive_permissions

        if self.instance and self.instance.pk and archive_permissions:
            archive_permission_ids = [permission.pk for permission in archive_permissions]
            self.fields["can_archive_documents"].initial = (
                self.instance.user_permissions.filter(pk__in=archive_permission_ids).count()
                == len(archive_permissions)
            )
        else:
            self.fields["can_archive_documents"].initial = False

        is_indok_norwegian = (
            self.instance.is_indok if self.instance and self.instance.pk else False
        )
        self.fields["is_indok_norwegian"].initial = is_indok_norwegian

    def save(self, commit=True):
        instance = super().save(commit=False)
        instance.is_indok = self.cleaned_data.get("is_indok_norwegian", False)

        if commit:
            instance.save()
            self.save_m2m()

        return instance

    def clean(self):
        cleaned_data = super().clean()

        # Hvis en bruker har "is_superuser" eller "can_archive_documents",
        # bør de også ha "is_staff" for å kunne logge inn på admin, dette fikser dette.
        if cleaned_data.get("is_superuser") or cleaned_data.get(
            "can_archive_documents"
        ):
            cleaned_data["is_staff"] = True

        return cleaned_data


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
                    ("first_name", "last_name"),
                    "email",
                    ("feide_email", "feide_userid"),
                    "graduation_year",
                    "phone_number",
                    "allergies",
                ),
                "classes": ("wide",),
            },
        ),
        (
            "Rettigheter",
            {
                "fields": (
                    ("is_staff", "is_superuser"),
                    ("can_manage_janhus_booking", "can_manage_janhus_settings"),
                    ("can_manage_cabins_booking", "can_manage_cabins_settings"),
                    ("can_view_sensitive_info", "can_manage_user_profiles"),
                    ("can_edit_nfc_cards", "can_archive_documents"),
                    "groups",
                    "user_permissions",
                ),
                "classes": ("wide",),
            },
        ),
        (
            "Systemfelter",
            {
                "fields": (
                    ("is_active", "is_indok_norwegian"),
                    ("last_login", "date_joined"),
                    "first_login",
                ),
            },
        ),
    )

    @staticmethod
    def _get_nfc_permission() -> Optional[Permission]:
        return Permission.objects.filter(
            codename="manage_user_nfc", content_type__app_label="users"
        ).first()

    @staticmethod
    def _sync_direct_permission(
        user: User, should_have: bool, permission: Optional[Permission]
    ) -> None:
        if permission is None:
            return

        has_direct_perm = user.user_permissions.filter(pk=permission.pk).exists()
        if should_have and not has_direct_perm:
            user.user_permissions.add(permission)
        elif not should_have and has_direct_perm:
            user.user_permissions.remove(permission)

    @staticmethod
    def _sync_multiple_direct_permissions(
        user: User, should_have: bool, permissions
    ) -> None:
        existing_permissions = [
            permission for permission in permissions if permission is not None
        ]
        if not existing_permissions:
            return

        existing_permission_ids = [permission.pk for permission in existing_permissions]
        has_any = user.user_permissions.filter(pk__in=existing_permission_ids).exists()
        has_all = user.user_permissions.filter(
            pk__in=existing_permission_ids
        ).count() == len(existing_permission_ids)

        if should_have and not has_all:
            user.user_permissions.add(*existing_permissions)
        elif not should_have and has_any:
            user.user_permissions.remove(*existing_permissions)

    def save_related(self, request, form, formsets, change):
        super().save_related(request, form, formsets, change)

        user = form.instance

        nfc_permission = self._get_nfc_permission()
        should_have_direct_perm = form.cleaned_data.get("can_edit_nfc_cards", False)
        self._sync_direct_permission(
            user=user, should_have=should_have_direct_perm, permission=nfc_permission
        )

        view_info = Permission.objects.filter(
            codename="view_sensitive_info", content_type__app_label="users"
        ).first()
        should_have_direct_perm = form.cleaned_data.get(
            "can_view_sensitive_info", False
        )
        self._sync_direct_permission(
            user=user, should_have=should_have_direct_perm, permission=view_info
        )

        manage_profiles = Permission.objects.filter(
            codename="manage_user_profiles", content_type__app_label="users"
        ).first()
        should_have_direct_perm = form.cleaned_data.get(
            "can_manage_user_profiles", False
        )
        self._sync_direct_permission(
            user=user, should_have=should_have_direct_perm, permission=manage_profiles
        )

        manage_janhus_booking = Permission.objects.filter(
            codename="manage_booking", content_type__app_label="janhus"
        ).first()
        should_have_direct_perm = form.cleaned_data.get(
            "can_manage_janhus_booking", False
        )
        self._sync_direct_permission(
            user=user,
            should_have=should_have_direct_perm,
            permission=manage_janhus_booking,
        )

        manage_janhus_settings = Permission.objects.filter(
            codename="manage_settings", content_type__app_label="janhus"
        ).first()
        should_have_direct_perm = form.cleaned_data.get(
            "can_manage_janhus_settings", False
        )
        self._sync_direct_permission(
            user=user,
            should_have=should_have_direct_perm,
            permission=manage_janhus_settings,
        )

        manage_cabins_booking = Permission.objects.filter(
            codename="manage_booking", content_type__app_label="cabins"
        ).first()
        change_cabin_permission = Permission.objects.filter(
            codename="change_cabin", content_type__app_label="cabins"
        ).first()
        should_have_direct_perm = form.cleaned_data.get(
            "can_manage_cabins_booking", False
        )
        self._sync_multiple_direct_permissions(
            user=user,
            should_have=should_have_direct_perm,
            permissions=[manage_cabins_booking, change_cabin_permission],
        )

        manage_cabins_settings = Permission.objects.filter(
            codename="change_bookingsemester", content_type__app_label="cabins"
        ).first()
        should_have_direct_perm = form.cleaned_data.get(
            "can_manage_cabins_settings", False
        )
        self._sync_direct_permission(
            user=user,
            should_have=should_have_direct_perm,
            permission=manage_cabins_settings,
        )

        archive_permissions = list(
            Permission.objects.filter(
                content_type__app_label="archive",
                codename__in=[
                    "add_archivedocument",
                    "change_archivedocument",
                    "delete_archivedocument",
                    "view_archivedocument",
                ],
            )
        )
        should_have_direct_perm = form.cleaned_data.get("can_archive_documents", False)
        self._sync_multiple_direct_permissions(
            user=user,
            should_have=should_have_direct_perm,
            permissions=archive_permissions,
        )
