from typing import TYPE_CHECKING
from utils.testing.base import ExtendedGraphQLTestCase
from utils.testing.factories.organizations import OrganizationFactory
from unittest import mock

if TYPE_CHECKING:
    from apps.organizations.models import Organization


class OrganizationBaseTestCase(ExtendedGraphQLTestCase):
    def setUp(self) -> None:
        super().setUp()
        self.org: Organization = OrganizationFactory()


class DefaultOrgPermSignalsTestCase(OrganizationBaseTestCase):
    @mock.patch("apps.organizations.signals.ensure_default_org_permission_groups")
    def test_ensure_default_org_permission_groups(self, signal: mock.MagicMock):
        self.org.save()
        self.assertTrue(signal.called)
        self.assertEqual(signal.call_count, 1)
