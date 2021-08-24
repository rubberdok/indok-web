from django.db import migrations, models
from apps.permissions.constants import ORGANIZATION

def add_org_members_to_permission_groups(apps, schema_editor):
  MembershipModel = apps.get_model('organizations', 'Membership')
  GroupModel = apps.get_model('auth', 'Group')
  UserModel = apps.get_model('users', 'User')

  organization_member_group = GroupModel.objects.get(name=ORGANIZATION)

  for membership in MembershipModel.objects.all():
    user = UserModel.objects.get(id=membership.user.id)

    if organization_member_group not in user.groups.all():
      user.groups.add(organization_member_group)
      print(f"User {membership.user.username} added to Organization member group")

    organization_hr_group = membership.organization.hr_group.group

    if membership.group.group == organization_hr_group and organization_hr_group not in user.groups.all():
      user.groups.add(organization_hr_group)
      print(f"User {membership.user.username} added to {membership.organization.name}'s HR group")
    

def remove_org_members_from_permission_groups(apps, schema_editor):
  MembershipModel = apps.get_model('organizations', 'Membership')
  GroupModel = apps.get_model('auth', 'Group')
  UserModel = apps.get_model('users', 'User')

  organization_member_group = GroupModel.objects.get(name=ORGANIZATION)

  for membership in MembershipModel.objects.all():
    user = UserModel.objects.get(id=membership.user.id)

    if organization_member_group in user.groups.all():
      user.groups.remove(organization_member_group)
      print(f"User {membership.user.username} removed from Organization member group")

    organization_hr_group = membership.organization.hr_group.group

    if membership.group.group == organization_hr_group and organization_hr_group in user.groups.all():
      user.groups.remove(organization_hr_group)
      print(f"User {membership.user.username} removed from {membership.organization.name}'s HR group")

class Migration(migrations.Migration):

  dependencies = [
    ('organizations', '0030_auto_20210426_2129'),
    ('users', '0007_auto_20210312_1746')
  ]

  operations = [
    migrations.RunPython(add_org_members_to_permission_groups, remove_org_members_from_permission_groups)
  ]