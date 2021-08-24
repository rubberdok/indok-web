from django.db import migrations, models
from apps.permissions.constants import ORGANIZATION

def add_org_members_to_permission_groups(apps, schema_editor):
  MembershipModel = apps.get_model('organizations', 'Membership')
  GroupModel = apps.get_model('auth', 'Group')

  organization_member_group = GroupModel.objects.get(name=ORGANIZATION)

  for membership in MembershipModel.objects.all():
    user_changed = False

    user_groups = membership.user.groups

    if organization_member_group not in user_groups.all():
      user_groups.add(organization_member_group)
      user_changed = True
      print(f"User {membership.user.username} added to Organization member group")

    organization_hr_group = membership.organization.hr_group.group

    if membership.group.group == organization_hr_group and organization_hr_group not in user_groups.all():
      user_groups.add(organization_hr_group)
      user_changed = True
      print(f"User {membership.user.username} added to {membership.organization.name}'s HR group")

    if user_changed:
      membership.user.save()
      print(f"{membership.user.username} updated")
    

def remove_org_members_from_permission_groups(apps, schema_editor):
  print("reversed, remove groups manually in Django admin")
  """ MembershipModel = apps.get_model('organizations', 'Membership')
  GroupModel = apps.get_model('auth', 'Group')

  organization_member_group = GroupModel.objects.get(name=ORGANIZATION)

  for membership in MembershipModel.objects.all():
    user_changed = False

    user_groups = membership.user.groups

    if organization_member_group in user_groups.all():
      user_groups.remove(organization_member_group)
      user_changed = True
      print(f"User {membership.user.username} removed from Organization member group")

    organization_hr_group = membership.organization.hr_group.group

    if membership.group.group == organization_hr_group and organization_hr_group in user_groups.all():
      user_groups.remove(organization_hr_group)
      user_changed = True
      print(f"User {membership.user.username} removed from {membership.organization.name}'s HR group")

    if user_changed:
      membership.user.save()
      print(f"{membership.user.username} updated") """

class Migration(migrations.Migration):

  dependencies = [
    ('organizations', '0030_auto_20210426_2129')
  ]

  operations = [
    migrations.RunPython(add_org_members_to_permission_groups, remove_org_members_from_permission_groups)
  ]