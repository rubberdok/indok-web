from django.test import TestCase
from utils.testing.factories.organizations import MembershipFactory, OrganizationFactory
from utils.testing.factories.users import UserFactory

from apps.permissions.constants import (
    DEFAULT_INDOK_PERMISSIONS,
    DEFAULT_ORGANIZATION_PERMISSIONS,
)


class StandardPermissionsTestCase(TestCase):
    def setUp(self) -> None:
        self.org_user = UserFactory()
        self.user = UserFactory()
        self.organization = OrganizationFactory()
        MembershipFactory(user=self.org_user, organization=self.organization)
        return super().setUp()

    def test_user_default_permissions(self) -> None:
        self.assertTrue(all(self.org_user.has_perm(f"{perm[0]}.{perm[1]}") for perm in DEFAULT_INDOK_PERMISSIONS))
        self.assertTrue(all(self.user.has_perm(f"{perm[0]}.{perm[1]}") for perm in DEFAULT_INDOK_PERMISSIONS))

    def test_organization_default_permissions(self) -> None:
        self.assertTrue(
            all(self.org_user.has_perm(f"{perm[0]}.{perm[1]}") for perm in DEFAULT_ORGANIZATION_PERMISSIONS)
        )
        self.assertFalse(any(self.user.has_perm(f"{perm[0]}.{perm[1]}") for perm in DEFAULT_ORGANIZATION_PERMISSIONS))
