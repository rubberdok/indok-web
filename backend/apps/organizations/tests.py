import json

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType

from apps.organizations.models import Membership
from utils.testing.base import ExtendedGraphQLTestCase
from utils.testing.factories.listings import ListingFactory
from utils.testing.factories.organizations import MembershipFactory, OrganizationFactory
from utils.testing.factories.users import UserFactory


class OrganizationMembershipAuthorizationTests(ExtendedGraphQLTestCase):
    def setUp(self):
        super().setUp()
        self.organization = OrganizationFactory()
        self.hr_user = UserFactory()
        self.regular_member = UserFactory()
        self.profile_manager_user = UserFactory()
        self.change_user_permission_user = UserFactory()
        self.target_user = UserFactory()

        MembershipFactory(
            user=self.hr_user,
            organization=self.organization,
            group=self.organization.hr_group,
        )
        MembershipFactory(
            user=self.regular_member,
            organization=self.organization,
            group=self.organization.primary_group,
        )

        permission = Permission.objects.get(codename="manage_user_profiles")
        self.profile_manager_user.user_permissions.add(permission)
        # The user model is swapped, so change_user lives on the users content type.
        change_user_permission = Permission.objects.get(
            codename="change_user",
            content_type=ContentType.objects.get_for_model(get_user_model()),
        )
        self.change_user_permission_user.user_permissions.add(change_user_permission)

    def test_upsert_membership_allows_hr_member_without_global_permission(self):
        response = self.query(
            f"""
            mutation {{
                upsertMembership(membershipData: {{
                    userId: \"{self.target_user.id}\"
                    organizationId: \"{self.organization.id}\"
                    groupId: \"{self.organization.primary_group.pk}\"
                }}) {{
                    ok
                    membership {{
                        id
                    }}
                }}
            }}
            """,
            user=self.hr_user,
        )

        self.assertResponseNoErrors(response)
        content = json.loads(response.content)
        self.assertTrue(content["data"]["upsertMembership"]["ok"])
        self.assertTrue(
            Membership.objects.filter(
                organization=self.organization,
                user=self.target_user,
                group=self.organization.primary_group,
            ).exists()
        )

    def test_upsert_membership_denies_regular_member_without_global_permission(self):
        response = self.query(
            f"""
            mutation {{
                upsertMembership(membershipData: {{
                    userId: \"{self.target_user.id}\"
                    organizationId: \"{self.organization.id}\"
                    groupId: \"{self.organization.primary_group.pk}\"
                }}) {{
                    ok
                    membership {{
                        id
                    }}
                }}
            }}
            """,
            user=self.regular_member,
        )

        self.assert_permission_error(response)

    def test_remove_membership_allows_hr_member_without_global_permission(self):
        membership = MembershipFactory(
            user=self.target_user,
            organization=self.organization,
            group=self.organization.primary_group,
        )

        response = self.query(
            f"""
            mutation {{
                removeMembership(membershipId: \"{membership.id}\") {{
                    ok
                    removedMember {{
                        id
                    }}
                }}
            }}
            """,
            user=self.hr_user,
        )

        self.assertResponseNoErrors(response)
        content = json.loads(response.content)
        self.assertTrue(content["data"]["removeMembership"]["ok"])
        self.assertFalse(Membership.objects.filter(id=membership.id).exists())

    def test_upsert_membership_allows_manage_user_profiles_without_org_membership(self):
        response = self.query(
            f"""
            mutation {{
                upsertMembership(membershipData: {{
                    userId: \"{self.target_user.id}\"
                    organizationId: \"{self.organization.id}\"
                    groupId: \"{self.organization.primary_group.pk}\"
                }}) {{
                    ok
                    membership {{
                        id
                    }}
                }}
            }}
            """,
            user=self.profile_manager_user,
        )

        self.assertResponseNoErrors(response)
        content = json.loads(response.content)
        self.assertTrue(content["data"]["upsertMembership"]["ok"])
        self.assertTrue(
            Membership.objects.filter(
                organization=self.organization,
                user=self.target_user,
                group=self.organization.primary_group,
            ).exists()
        )

    def test_remove_membership_allows_manage_user_profiles_without_org_membership(self):
        membership = MembershipFactory(
            user=self.target_user,
            organization=self.organization,
            group=self.organization.primary_group,
        )

        response = self.query(
            f"""
            mutation {{
                removeMembership(membershipId: \"{membership.id}\") {{
                    ok
                    removedMember {{
                        id
                    }}
                }}
            }}
            """,
            user=self.profile_manager_user,
        )

        self.assertResponseNoErrors(response)
        content = json.loads(response.content)
        self.assertTrue(content["data"]["removeMembership"]["ok"])
        self.assertFalse(Membership.objects.filter(id=membership.id).exists())

    def test_upsert_membership_denies_auth_change_user_without_org_membership(self):
        response = self.query(
            f"""
            mutation {{
                upsertMembership(membershipData: {{
                    userId: \"{self.target_user.id}\"
                    organizationId: \"{self.organization.id}\"
                    groupId: \"{self.organization.primary_group.pk}\"
                }}) {{
                    ok
                    membership {{
                        id
                    }}
                }}
            }}
            """,
            user=self.change_user_permission_user,
        )

        self.assert_permission_error(response)


class OrganizationListingsResolverTests(ExtendedGraphQLTestCase):
    def test_organization_listings_query_returns_data_without_errors(self):
        organization = OrganizationFactory()
        listing = ListingFactory(organization=organization)

        response = self.query(
            """
            query($organizationId: ID!) {
                organization(id: $organizationId) {
                    id
                    listings {
                        id
                        title
                    }
                }
            }
            """,
            variables={"organizationId": str(organization.id)},
        )

        self.assertResponseNoErrors(response)
        content = json.loads(response.content)

        returned_organization = content["data"]["organization"]
        self.assertEqual(returned_organization["id"], str(organization.id))

        listing_ids = {item["id"] for item in returned_organization["listings"]}
        self.assertIn(str(listing.id), listing_ids)
