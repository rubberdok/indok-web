from django.db import migrations

OLD_NAME = "Can edit NFC UID/PIN for users"
NEW_NAME = "Can edit NFC card, PIN and permanent door access for users"


def _rename(apps, name):
    apps.get_model("auth", "Permission").objects.filter(
        codename="manage_user_nfc", content_type__app_label="users"
    ).update(name=name)


def rename_forward(apps, schema_editor):
    _rename(apps, NEW_NAME)


def rename_back(apps, schema_editor):
    _rename(apps, OLD_NAME)


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0022_alter_user_options"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="user",
            options={
                "permissions": [
                    (
                        "view_sensitive_info",
                        "Can view sensitive information about a user",
                    ),
                    (
                        "manage_user_profiles",
                        "Can search and edit other users' profiles",
                    ),
                    ("manage_user_nfc", NEW_NAME),
                ]
            },
        ),
        migrations.RunPython(rename_forward, rename_back),
    ]
