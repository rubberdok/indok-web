from django.db import migrations

from apps.permissions.constants import ORG_ADMIN_GROUP_NAME, ORG_ADMIN_TYPE, ORG_MEMBER_TYPE


def migrate_org_groups(apps, schema_editor):
    """Rename admin_group to admin_group and member_group to member_group"""

    Organization = apps.get_model("organizations", "Organization")

    for org in Organization.objects.all():
        if org.admin_group is not None:
            org.admin_group.group_type = ORG_ADMIN_TYPE
            org.group.name = ORG_ADMIN_GROUP_NAME
            org.admin_group.save()
        if org.member_group is not None:
            org.member_group.group_type = ORG_MEMBER_TYPE
            org.group.name = ORG_ADMIN_GROUP_NAME
            org.member_group.save()


class Migration(migrations.Migration):

    dependencies = [
        ("permissions", "0011_merge_0004_auto_20210824_2126_0010_auto_20210824_1546"),
        ("organizations", "0033_merge_0031_auto_20210909_1813_0032_auto_20210824_1457"),
    ]

    operations = [migrations.RunPython(migrate_org_groups)]
