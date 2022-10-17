from django.db import migrations

from apps.permissions.constants import ORG_ADMIN_TYPE, ORG_MEMBER_TYPE


def migrate_org_groups(apps, schema_editor):
    """Rename hr_group to admin_group and primary_group to member_group"""

    Organization = apps.get_model("organizations", "Organization")

    for org in Organization.objects.all():
        if org.hr_group is not None:
            org.hr_group.group_type = ORG_ADMIN_TYPE
        if org.primary_group is not None:
            org.primary_group.group_type = ORG_MEMBER_TYPE


class Migration(migrations.Migration):

    dependencies = [
        ("permissions", "0011_merge_0004_auto_20210824_2126_0010_auto_20210824_1546"),
        ("organizations", "0033_merge_0031_auto_20210909_1813_0032_auto_20210824_1457"),
    ]

    operations = [migrations.RunPython(migrate_org_groups)]
