from apps.users.models import User
from apps.organizations.models import Organization, Member

def check_user_membership(user: User, organization: Organization):
  membership = Member.objects.filter(member=user, organization=organization)
  if not membership:
    raise PermissionError(f"{user.username}({user.id}) is not a member of {organization.name}({organization.id})")