import json
from datetime import datetime

from graphene.utils.str_converters import to_snake_case

from ...utils.testing.ExtendedGraphQLTestCase import ExtendedGraphQLTestCase
from ...utils.testing.factories.organizations import OrganizationFactory, MembershipFactory
from ...utils.testing.factories.users import UserFactory

class ListingsBaseTestCase(ExtendedGraphQLTestCase):
  def setUp(self) -> None:
    super().setUp()

    self.user = UserFactory()
    self.organization = OrganizationFactory()
    self.organization_user = UserFactory()
    self.membership = MembershipFactory(user=self.organization_user, organization=self.organization)


class ListingsResolversTestCase(ListingsBaseTestCase):
  query = """
    query {
      listings {
        id
      }
    }
  """
