import json
import datetime
from django.utils import timezone
from graphene.utils.str_converters import to_snake_case
from guardian.shortcuts import assign_perm

from apps.listings.models import Listing

from ...utils.testing.ExtendedGraphQLTestCase import ExtendedGraphQLTestCase
from ...utils.testing.factories.organizations import OrganizationFactory, MembershipFactory, RoleFactory
from ...utils.testing.factories.listings import ListingFactory
from ...utils.testing.factories.users import UserFactory

class ListingsBaseTestCase(ExtendedGraphQLTestCase):
  def setUp(self) -> None:
    super().setUp()

    # Create a normal user
    self.user = UserFactory()

    # Create a user belonging to an organization
    self.organization_with_listing = OrganizationFactory()
    self.organization_without_listing = OrganizationFactory()

    self.organization_user = UserFactory()
    self.membership = MembershipFactory(
      user=self.organization_user,
      organization=self.organization_with_listing,
      role=RoleFactory()
    )

    # Create a few listings
    self.valid_future_listing = ListingFactory(
      organization=self.organization_with_listing,
      start_datetime=timezone.now().isoformat(),
      end_datetime=(timezone.now() + datetime.timedelta(days=30)).isoformat(),
      deadline=(timezone.now() + datetime.timedelta(days=30)).isoformat(),
    )

    # Create listings in the past
    self.listing_in_the_past = ListingFactory(
      organization=self.organization_with_listing,
      start_datetime=(timezone.now() - datetime.timedelta(days=10)).isoformat(),
      end_datetime=timezone.now().isoformat(),
      deadline=(timezone.now() - datetime.timedelta(days=1)).isoformat()
    )


class ListingsResolversTestCase(ListingsBaseTestCase):
  def test_resolve_listings(self):
    query = """
      query {
        listings {
          id
          description
          title
          startDatetime
          endDatetime
          deadline
          organization {
            id
            name
          }
        }
      }
    """

    response = self.query(query)
    self.assertResponseNoErrors(response)

    content = json.loads(response.content)
    listings = content["data"]["listings"]

    # Ensure only future listings are shown
    self.assertEquals(len(listings), 1)
  
  def create_listing(self, listing: Listing, user=None):
    print(listing.title)
    print(listing.description)
    print(listing.organization.id)
    print(listing.deadline)
    print(listing.start_datetime)
    mutation = f"""
      mutation {{
        createListing(
          listingData: {{
            title: \"{listing.title}\"
            description: \"{listing.description}\"
            deadline: \"{listing.deadline}\"
            startDatetime: \"{listing.start_datetime}\"
            organizationId: \"{listing.organization.id}\"
          }}
        ) {{
            ok
        }}
      }} 
    """
    print(mutation)
    if user is not None:
      self.query(mutation, user=user)
    return self.query(mutation)
  
  def test_create_listing(self):
    # Attempt to create a listing without the required permission
    response = self.create_listing(listing=self.valid_future_listing)
    self.assertResponseHasErrors(response)

    # Temporarily add add_listing permission
    assign_perm("listings.add_listing", self.organization_user)
    # Create listing with a user in an organization
    response = self.create_listing(
      listing=self.valid_future_listing,
      user=self.organization_user
    )
    print(response)
    self.assertResponseNoErrors(response)

    # Attempt to create a listing without permissions
    response = self.create_listing(self.valid_future_listing, user=self.user)
    self.assertResponseHasErrors(response)

