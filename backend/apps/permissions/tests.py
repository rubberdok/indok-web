from django.test import TestCase
from utils.testing.factories.organizations import MembershipFactory, OrganizationFactory
from utils.testing.factories.users import IndokUserFactory, UserFactory

from apps.permissions.constants import (
    DEFAULT_INDOK_PERMISSIONS,
    DEFAULT_ORGANIZATION_PERMISSIONS,
    DEFAULT_REGISTERED_USER_PERMISSIONS,
)


class StandardPermissionsTestCase(TestCase):
    def setUp(self) -> None:
        self.org_user = IndokUserFactory()
        self.user = IndokUserFactory()
        self.non_indok_user = UserFactory()
        self.organization = OrganizationFactory()
        MembershipFactory(user=self.org_user, organization=self.organization)
        return super().setUp()

    def test_user_default_permissions(self) -> None:
        self.assertTrue(all(self.user.has_perm(".".join(perm)) for perm in DEFAULT_INDOK_PERMISSIONS))
        self.assertTrue(all(self.org_user.has_perm(".".join(perm)) for perm in DEFAULT_INDOK_PERMISSIONS))

    def test_organization_default_permissions(self) -> None:
        self.assertTrue(all(self.org_user.has_perm(".".join(perm)) for perm in DEFAULT_ORGANIZATION_PERMISSIONS))
        self.assertFalse(any(self.user.has_perm(".".join(perm)) for perm in DEFAULT_ORGANIZATION_PERMISSIONS))

    def test_non_indok_permissions(self):
        self.assertFalse(any(self.non_indok_user.has_perm(".".join(perm)) for perm in DEFAULT_INDOK_PERMISSIONS))
        self.assertTrue(
            all(self.non_indok_user.has_perm(".".join(perm)) for perm in DEFAULT_REGISTERED_USER_PERMISSIONS)
        )
