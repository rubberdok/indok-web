from django.db import migrations


def migrate_membership_groups(apps, schema_editor):
    """Moves existing membership groups to new 'groups' field"""

    Membership = apps.get_model('organizations', 'Membership')

    for membership in Membership.objects.all():
        if (membership.group is not None):
            membership.groups.add(membership.group)


def reverse_membership_groups(apps, schema_editor):
    """
        Moves membership groups back to old 'group' field
        Chooses the first group found if there are several
    """

    Membership = apps.get_model('organizations', 'Membership')

    for membership in Membership.objects.all():
        for group in membership.groups.all():
            membership.group = group
            membership.save()
            return


class Migration(migrations.Migration):

    dependencies = [
        ('permissions', '0011_merge_0004_auto_20210824_2126_0010_auto_20210824_1546'),
        ('organizations', '0035_auto_20211004_1923'),
    ]

    operations = [
        migrations.RunPython(migrate_membership_groups, reverse_membership_groups)
    ]
