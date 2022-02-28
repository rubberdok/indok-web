from datetime import timedelta
from unittest.mock import MagicMock, patch

from django.utils import timezone
from utils.testing.base import ExtendedGraphQLTestCase
from utils.testing.factories.events import EventFactory
from utils.testing.factories.organizations import MembershipFactory
from utils.testing.factories.users import IndokUserFactory


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
    def test_send_mail_on_user_bumped_from_waiting_list_by_admin(self, send_mail_mock: MagicMock):
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
        self.query(admin_event_signoff_query, self.org_user)

        # Check that we only attempt to send one email
        self.assertEqual(len(send_mail_mock.call_args_list), 1)

        # Check that we attempt to send an email to user2
        self.assertEqual(send_mail_mock.call_args.args[0], self.user2)
        self.assertEqual(send_mail_mock.call_args.args[1], self.event)

    @patch("apps.events.mail.EventEmail.send_waitlist_notification_email")
    def test_send_mail_on_user_bumped_from_waiting_list(self, send_mail_mock: MagicMock):
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
        self.query(event_signoff_query, self.user1)

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
        self.query(expand_slots_mutation, self.org_user)

        # Check that we attempt to send an email to two users
        self.assertEqual(len(send_mail_mock.call_args_list), 2)
        # Check that we sent emails to the correct users
        self.assertEqual(send_mail_mock.call_args_list[0].args[0], self.user2)
        self.assertEqual(send_mail_mock.call_args_list[0].args[1], self.event)
        self.assertEqual(send_mail_mock.call_args_list[1].args[0], self.user3)
        self.assertEqual(send_mail_mock.call_args_list[1].args[1], self.event)
