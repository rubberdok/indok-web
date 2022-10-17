from django.db import migrations

from apps.permissions.constants import ORG_ADMIN_TYPE, ORG_MEMBER_TYPE


def migrate_org_groups(apps, schema_editor):
    """Rename hr_group to admin_group and primary_group to member_group"""

    Organization = apps.get_model("organizations", "Organization")

    for organization in Organization.objects.all():
        organization.hr_group.group_type = ORG_ADMIN_TYPE
        organization.primary_group.group_type = ORG_MEMBER_TYPE


class Migration(migrations.Migration):

    dependencies = [
        ("permissions", "0011_merge_0004_auto_20210824_2126_0010_auto_20210824_1546"),
        ("organizations", "0035_auto_20211004_1923"),
    ]

    operations = [migrations.RunPython(migrate_org_groups)]
