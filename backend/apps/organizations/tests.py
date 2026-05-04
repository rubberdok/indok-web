import json

from apps.organizations.models import Membership
from utils.testing.base import ExtendedGraphQLTestCase
from utils.testing.factories.organizations import MembershipFactory, OrganizationFactory
from utils.testing.factories.users import UserFactory


class OrganizationMembershipAuthorizationTests(ExtendedGraphQLTestCase):
    def setUp(self):
        super().setUp()
        self.organization = OrganizationFactory()
        self.hr_user = UserFactory()
        self.regular_member = UserFactory()
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

    def test_upsert_membership_allows_hr_member_without_global_permission(self):
        response = self.query(
            f"""
            mutation {{
                upsertMembership(membershipData: {{
                    userId: \"{self.target_user.id}\"
                    organizationId: \"{self.organization.id}\"
                    groupId: \"{self.organization.primary_group.id}\"
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
                    groupId: \"{self.organization.primary_group.id}\"
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
