import json
from datetime import timedelta

from django.utils import timezone
from utils.testing.base import ExtendedGraphQLTestCase
from utils.testing.factories.listings import ListingFactory
from utils.testing.factories.organizations import MembershipFactory, OrganizationFactory
from utils.testing.factories.users import UserFactory

from apps.listings.models import Listing


class ListingBaseTestCase(ExtendedGraphQLTestCase):
    def setUp(self) -> None:
        self.authorized_user = UserFactory()
        self.unauthorized_user = UserFactory()

        self.organization = OrganizationFactory()
        MembershipFactory(user=self.authorized_user, organization=self.organization)

        self.now = timezone.now()
        self.one_day_ago = timezone.now() - timedelta(days=1)
        self.two_days_ago = timezone.now() - timedelta(days=2)
        self.one_day_ahead = timezone.now() + timedelta(days=1)
        self.two_days_ahead = timezone.now() + timedelta(days=2)
        self.thirty_days_ahead = timezone.now() + timedelta(days=30)

        self.visible_listing = ListingFactory(
            start_datetime=self.one_day_ago,
            deadline=self.one_day_ahead,
            organization=self.organization,
            end_datetime=self.thirty_days_ahead,
        )
        self.expired_listing = ListingFactory(
            start_datetime=self.two_days_ago,
            deadline=self.one_day_ago,
            organization=self.organization,
            end_datetime=self.thirty_days_ahead,
        )
        self.future_listing = ListingFactory(
            start_datetime=self.one_day_ahead,
            deadline=self.two_days_ahead,
            organization=self.organization,
            end_datetime=self.thirty_days_ahead,
        )

        return super().setUp()


class ListingResolverTestCase(ListingBaseTestCase):
    def setUp(self) -> None:
        return super().setUp()

    def test_resolve_listings(self):
        """
        Expect to find all listings whose start datetime is in the past and deadline is in the future.
        """
        query = """
            query {
                listings {
                    id
                }
            }
        """
        response = self.query(query)
        self.assertResponseNoErrors(response)
        data = json.loads(response.content)["data"]
        listings = data["listings"]
        self.assertEqual(
            len(listings),
            1,
            f"""
                Only expected the listing with id {self.visible_listing.id} to be visible,
                but found multiple: {[listing['id'] for listing in listings]}
            """,
        )
        for listing in listings:
            self.deep_assert_equal(listing, self.visible_listing)

    def test_resolve_listing(self):
        query = f"""
            query {{
                listing(id: {self.visible_listing.id}) {{
                    id
                    title
                    description
                    startDatetime
                    endDatetime
                    applicationUrl
                    deadline
                    readMoreUrl
                    organization {{
                        id
                    }}
                }}
            }}
        """
        response = self.query(query)
        self.assertResponseNoErrors(response)
        data = json.loads(response.content)["data"]
        listing = data["listing"]
        self.deep_assert_equal(listing, self.visible_listing)

    def test_view_counter(self):
        query = f"""
            query {{
                listing(id: {self.visible_listing.id}) {{
                    viewCount
                }}
            }}
        """
        response = self.query(query)
        view_count = json.loads(response.content)["data"]["listing"]["viewCount"]
        self.assertEqual(view_count, 1)

        for _ in range(5):
            response = self.query(query)

        view_count = json.loads(response.content)["data"]["listing"]["viewCount"]
        self.assertEqual(view_count, 6)


class ListingMutationTestCase(ListingBaseTestCase):
    def setUp(self) -> None:
        super().setUp()
        self.TITLE = "TITLE"
        self.DESCRIPTION = "DESCRIPTION"
        self.URL = "https://www.google.com/"
        self.create_mutation = f"""
            mutation {{
                createListing(listingData: {{
                    title: "{self.TITLE}"
                    description: "{self.DESCRIPTION}"
                    organizationId: {self.organization.pk}
                    startDatetime: "{self.now.isoformat()}"
                    deadline: "{self.one_day_ahead.isoformat()}"
                    applicationUrl: "{self.URL}"
                    readMoreUrl: "{self.URL}"
                }}) {{
                    ok
                    listing {{
                        id
                        title
                        description
                        applicationUrl
                        startDatetime
                        organization {{
                            id
                            name
                        }}
                        deadline
                        readMoreUrl
                    }}
                }}
            }}
        """
        self.update_mutation = f"""
            mutation {{
                updateListing(
                    id: {self.visible_listing.id},
                    listingData: {{
                        title: "{self.TITLE} NEW"
                        description: "{self.DESCRIPTION}"
                        startDatetime: "{self.one_day_ago.isoformat()}"
                        deadline: "{self.two_days_ahead.isoformat()}"
                        applicationUrl: "{self.URL}"
                        readMoreUrl: "{self.URL}"
                    }}
                ) {{
                    ok
                    listing {{
                        id
                        title
                        description
                        applicationUrl
                        startDatetime
                        organization {{
                            id
                            name
                        }}
                        deadline
                        readMoreUrl
                    }}
                }}
            }}
        """

        self.delete_mutation = f"""
            mutation {{
                deleteListing(id: {self.visible_listing.id}) {{
                    ok
                }}
            }}
        """

    def test_unauthorized_create_listing(self):
        response = self.query(self.create_mutation)
        self.assert_permission_error(response)
        response = self.query(self.create_mutation, user=self.unauthorized_user)
        self.assert_permission_error(response)

    def test_unauthorized_change_listing(self):
        response = self.query(self.update_mutation)
        self.assert_permission_error(response)
        response = self.query(self.update_mutation, user=self.unauthorized_user)
        self.assert_permission_error(response)

    def test_unauthorized_delete_listing(self):
        response = self.query(self.delete_mutation)
        self.assert_permission_error(response)
        response = self.query(self.delete_mutation, user=self.unauthorized_user)
        self.assert_permission_error(response)

    def test_authorized_create_listing(self):
        response = self.query(self.create_mutation, user=self.authorized_user)
        self.assertResponseNoErrors(response)

        data = json.loads(response.content)["data"]
        listing_data = data["createListing"]["listing"]
        listing = Listing.objects.get(pk=listing_data["id"])
        self.deep_assert_equal(listing_data, listing)

    def test_authorized_change_listing(self):
        response = self.query(self.update_mutation, user=self.authorized_user)
        self.assertResponseNoErrors(response)

        data = json.loads(response.content)["data"]
        listing_data = data["updateListing"]["listing"]
        self.deep_assert_equal(listing_data, Listing.objects.get(pk=self.visible_listing.pk))

    def test_authorized_delete_listing(self):
        response = self.query(self.delete_mutation, user=self.authorized_user)
        self.assertResponseNoErrors(response)

        try:
            Listing.objects.get(pk=self.visible_listing.pk)
            self.fail("Expected the listing to be deleted, but it was not.")
        except Listing.DoesNotExist:
            pass
