import base64
import json
from datetime import timedelta
from unittest.mock import MagicMock, patch

import pandas as pd
from django.utils import timezone
from utils.testing.base import ExtendedGraphQLTestCase
from utils.testing.factories.events import EventFactory
from utils.testing.factories.organizations import MembershipFactory, OrganizationFactory
from utils.testing.factories.users import IndokUserFactory

from .resolvers import wrap_attendee_report_as_json


class EventsBaseTestCase(ExtendedGraphQLTestCase):
    def setUp(self) -> None:
        super().setUp()


class EventsMailTestCase(EventsBaseTestCase):
    def setUp(self) -> None:
        super().setUp()

        self.user1 = IndokUserFactory()
        self.user2 = IndokUserFactory()
        self.user3 = IndokUserFactory()
        self.user4 = IndokUserFactory()
        self.event = EventFactory(
            is_attendable=True,
            available_slots=1,
            binding_signup=False,
            signup_open_date=timezone.now() - timedelta(days=1),
        )
        self.org_user = IndokUserFactory()
        MembershipFactory(user=self.org_user, organization=self.event.organization)
        event_signup_query = f"""
                mutation EventSignUp {{
                    eventSignUp(
                        eventId: {self.event.id},
                        data: {{ extraInformation: \"\" }}
                        ) {{
                      isFull
                        }}
                    }}
                """
        # Sign up four users for an event with 1 available slot
        self.query(event_signup_query, user=self.user1)
        self.query(event_signup_query, user=self.user2)
        self.query(event_signup_query, user=self.user3)
        self.query(event_signup_query, user=self.user4)

    @patch("apps.events.mail.EventEmail.send_waitlist_notification_email")
    def test_send_mail_on_user_bumped_from_waiting_list_by_admin(
        self, send_mail_mock: MagicMock
    ):
        admin_event_signoff_query = f"""
                mutation AdminEventSignOff {{
                    adminEventSignOff(
                        eventId: {self.event.id},
                        userId: {self.user1.id}
                        ) {{
                      event {{
                          id
                      }}
                        }}
                    }}
                """
        # Sign off a user from the event
        self.query(admin_event_signoff_query, user=self.org_user)

        # Check that we only attempt to send one email
        self.assertEqual(len(send_mail_mock.call_args_list), 1)

        # Check that we attempt to send an email to user2
        self.assertEqual(send_mail_mock.call_args.args[0], self.user2)
        self.assertEqual(send_mail_mock.call_args.args[1], self.event)

    @patch("apps.events.mail.EventEmail.send_waitlist_notification_email")
    def test_send_mail_on_user_bumped_from_waiting_list(
        self, send_mail_mock: MagicMock
    ):
        event_signoff_query = f"""
                mutation EventSignOff {{
                    eventSignOff(
                        eventId: {self.event.id},
                        ) {{
                      isFull
                        }}
                    }}
                """
        # A user signs off an event "by themselves"
        self.query(event_signoff_query, user=self.user1)

        # Check that we only attempt to send one email
        self.assertEqual(len(send_mail_mock.call_args_list), 1)

        # Check that we attempt to send an email to user2
        self.assertEqual(send_mail_mock.call_args.args[0], self.user2)
        self.assertEqual(send_mail_mock.call_args.args[1], self.event)

    @patch("apps.events.mail.EventEmail.send_waitlist_notification_email")
    def test_send_mail_on_available_slots_expanded(self, send_mail_mock: MagicMock):
        expand_slots_mutation = f"""
            mutation {{
            updateEvent(id: {self.event.id}, eventData: {{availableSlots: 3}}) {{
                ok
            }}
            }}
            """
        # Increase available slots to 3
        self.query(expand_slots_mutation, user=self.org_user)

        # Check that we attempt to send an email to two users
        self.assertEqual(len(send_mail_mock.call_args_list), 2)
        # Check that we sent emails to the correct users
        self.assertEqual(send_mail_mock.call_args_list[0].args[0], self.user2)
        self.assertEqual(send_mail_mock.call_args_list[0].args[1], self.event)
        self.assertEqual(send_mail_mock.call_args_list[1].args[0], self.user3)
        self.assertEqual(send_mail_mock.call_args_list[1].args[1], self.event)


class HiddenEventTestCase(EventsBaseTestCase):
    def setUp(self) -> None:
        super().setUp()
        self.visible_event = EventFactory(is_attendable=False, is_hidden=False)
        self.hidden_event = EventFactory(is_attendable=False, is_hidden=True)

    def test_hidden_event_excluded_from_all_events(self):
        query = """
            query {
                allEvents {
                    id
                }
            }
        """
        response = self.query(query)
        event_ids = {event["id"] for event in response.json()["data"]["allEvents"]}
        self.assertIn(str(self.visible_event.id), event_ids)
        self.assertNotIn(str(self.hidden_event.id), event_ids)

    def test_hidden_event_excluded_from_all_events_with_filters(self):
        query = f"""
            query {{
                allEvents(organization: "{self.hidden_event.organization.name}") {{
                    id
                }}
            }}
        """
        response = self.query(query)
        event_ids = {event["id"] for event in response.json()["data"]["allEvents"]}
        self.assertNotIn(str(self.hidden_event.id), event_ids)

    def test_hidden_event_excluded_from_default_events(self):
        query = """
            query {
                defaultEvents {
                    id
                }
            }
        """
        response = self.query(query)
        event_ids = {event["id"] for event in response.json()["data"]["defaultEvents"]}
        self.assertNotIn(str(self.hidden_event.id), event_ids)

    def test_hidden_event_still_accessible_by_id(self):
        query = f"""
            query {{
                event(id: {self.hidden_event.id}) {{
                    id
                }}
            }}
        """
        response = self.query(query)
        self.assertEqual(response.json()["data"]["event"]["id"], str(self.hidden_event.id))

    def test_update_event_can_set_is_hidden(self):
        org_user = IndokUserFactory()
        MembershipFactory(user=org_user, organization=self.visible_event.organization)
        mutation = f"""
            mutation {{
                updateEvent(id: {self.visible_event.id}, eventData: {{isHidden: true}}) {{
                    ok
                    event {{
                        isHidden
                    }}
                }}
            }}
        """
        response = self.query(mutation, user=org_user)
        self.assertTrue(response.json()["data"]["updateEvent"]["ok"])
        self.assertTrue(response.json()["data"]["updateEvent"]["event"]["isHidden"])


class EventQueryValidationTestCase(EventsBaseTestCase):
    def test_event_query_with_empty_string_id_returns_null_without_errors(self):
        query = """
            query {
                event(id: "") {
                    id
                }
            }
        """

        response = self.query(query)

        self.assertResponseNoErrors(response)
        self.assertIsNone(response.json()["data"]["event"])

    def test_category_query_with_empty_string_id_returns_null_without_errors(self):
        query = """
            query {
                category(id: "") {
                    id
                }
            }
        """

        response = self.query(query)

        self.assertResponseNoErrors(response)
        self.assertIsNone(response.json()["data"]["category"])

    def test_attendee_report_with_empty_event_id_returns_null_without_errors(self):
        query = """
            query {
                attendeeReport(eventId: "")
            }
        """

        response = self.query(query)

        self.assertResponseNoErrors(response)
        self.assertIsNone(response.json()["data"]["attendeeReport"])

    def test_attendee_reports_with_empty_event_id_returns_null_without_errors(self):
        query = """
            query {
                attendeeReports(eventIds: [""])
            }
        """

        response = self.query(query)

        self.assertResponseNoErrors(response)
        self.assertIsNone(response.json()["data"]["attendeeReports"])

    def test_attendee_report_org_with_empty_org_id_returns_null_without_errors(self):
        query = """
            query {
                attendeeReportOrg(orgId: "")
            }
        """

        response = self.query(query)

        self.assertResponseNoErrors(response)
        self.assertIsNone(response.json()["data"]["attendeeReportOrg"])

    def test_sign_ups_with_empty_event_id_returns_null_without_errors(self):
        query = """
            query {
                signUps(eventId: "") {
                    id
                }
            }
        """

        response = self.query(query)

        self.assertResponseNoErrors(response)
        self.assertIsNone(response.json()["data"]["signUps"])


class EventMutationAuthorizationTestCase(ExtendedGraphQLTestCase):
    def setUp(self):
        super().setUp()
        self.organization = OrganizationFactory()
        self.hr_user = IndokUserFactory()
        self.normal_member = IndokUserFactory()
        self.superuser = IndokUserFactory(is_superuser=True)
        MembershipFactory(
            user=self.hr_user,
            organization=self.organization,
            group=self.organization.hr_group,
        )
        MembershipFactory(user=self.normal_member, organization=self.organization)
        self.event = EventFactory(
            organization=self.organization,
            is_attendable=False,
        )

    def test_event_mutation_role_matrix(self):
        create_mutation = f'''
            mutation {{
                createEvent(eventData: {{
                    title: "New event"
                    description: "Description"
                    startTime: "{timezone.now().isoformat()}"
                    isAttendable: false
                    organizationId: {self.organization.id}
                }}) {{ ok }}
            }}
        '''
        update_mutation = f'''
            mutation {{ updateEvent(id: {self.event.id}, eventData: {{ title: "Updated" }}) {{ ok }} }}
        '''
        delete_mutation = f'''
            mutation {{ deleteEvent(id: {self.event.id}) {{ ok }} }}
        '''

        self.assert_permission_error(self.query(create_mutation, user=self.normal_member))
        self.assertResponseNoErrors(self.query(create_mutation, user=self.hr_user))
        self.assertResponseNoErrors(self.query(update_mutation, user=self.normal_member))
        self.assert_permission_error(self.query(delete_mutation, user=self.normal_member))
        self.assertResponseNoErrors(self.query(delete_mutation, user=self.hr_user))

    def test_superuser_can_manage_events_without_membership(self):
        create_mutation = f'''
            mutation {{
                createEvent(eventData: {{
                    title: "New event"
                    description: "Description"
                    startTime: "{timezone.now().isoformat()}"
                    isAttendable: false
                    organizationId: {self.organization.id}
                }}) {{ ok }}
            }}
        '''
        update_mutation = f'''
            mutation {{ updateEvent(id: {self.event.id}, eventData: {{ title: "Updated" }}) {{ ok }} }}
        '''
        delete_mutation = f'''
            mutation {{ deleteEvent(id: {self.event.id}) {{ ok }} }}
        '''

        self.assertResponseNoErrors(self.query(create_mutation, user=self.superuser))
        self.assertResponseNoErrors(self.query(update_mutation, user=self.superuser))
        self.assertResponseNoErrors(self.query(delete_mutation, user=self.superuser))

    def test_hr_member_cannot_update_event_in_another_organization(self):
        other_event = EventFactory(
            organization=OrganizationFactory(),
            is_attendable=False,
        )
        mutation = f'''
            mutation {{ updateEvent(id: {other_event.id}, eventData: {{ title: "Updated" }}) {{ ok }} }}
        '''

        response = self.query(mutation, user=self.hr_user)

        self.assert_permission_error(response)


class AttendeeReportExportTestCase(EventsBaseTestCase):
    def test_wrap_attendee_report_as_json_supports_xlsx(self):
        dataframe = pd.DataFrame(
            {
                "signup_timestamp": [pd.Timestamp("2026-05-22T10:00:00+00:00")],
                "order_timestamp": [pd.Timestamp("2026-05-22T11:00:00+00:00")],
                "event_title": ["Test event"],
            }
        )

        payload = wrap_attendee_report_as_json(
            dataframe, "attendee_report__eventid_1", "xlsx"
        )
        parsed_payload = json.loads(payload)

        self.assertEqual(
            parsed_payload["filename"], "attendee_report__eventid_1.xlsx"
        )
        self.assertEqual(
            parsed_payload["contentType"],
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )

        decoded_data = base64.b64decode(parsed_payload["data"])
        self.assertGreater(len(decoded_data), 0)
