import json
from apps.events.models import Event, Category, SignUp
from utils.testing.factories.users import IndokUserFactory, UserFactory
from utils.testing.factories.events import (
    EventFactory,
    AttendableFactory,
    CategoryFactory,
    SignUpFactory,
    SimplifiedOrganizationFactory,
)
from unittest.mock import MagicMock, patch
from utils.testing.factories.organizations import MembershipFactory
from utils.testing.base import ExtendedGraphQLTestCase
import datetime
from django.utils import timezone


class EventsBaseTestCase(ExtendedGraphQLTestCase):
    def setUp(self) -> None:
        super().setUp()
        # Create three events
        self.non_attendable_event = EventFactory()
        self.attendable_and_open_event = EventFactory(
            start_time=timezone.now() + datetime.timedelta(seconds=1),
            allowed_grade_years="1,2,3",
        )
        self.attendable_event_with_slot_dist = EventFactory(allowed_grade_years="1,2,4")

        # Make one attendable without specific slot distribution
        AttendableFactory(
            event=self.attendable_and_open_event,
            signup_open_date=timezone.now() + datetime.timedelta(microseconds=100),
            slot_distribution={"1,2,3": 1},
            total_available_slots=1,
        )
        # Make one attendable with specific slot distribution
        AttendableFactory(
            event=self.attendable_event_with_slot_dist,
            slot_distribution={"1,2": 1, "4": 1},
            total_available_slots=2,
        )

        # Create some categories
        self.first_category = CategoryFactory()
        self.second_category = CategoryFactory()

        # Create (logged in) users
        now = datetime.datetime.now()
        current_year = now.year
        year_val = 5 if now.month < 8 else 6

        self.user_1st_grade = IndokUserFactory(graduation_year=year_val + current_year - 1)
        self.user_2nd_grade = IndokUserFactory(graduation_year=year_val + current_year - 2)
        self.user_3rd_grade = IndokUserFactory(graduation_year=year_val + current_year - 3)
        self.user_4th_grade = IndokUserFactory(graduation_year=year_val + current_year - 4)
        self.user_not_indok = UserFactory(graduation_year=year_val + current_year - 1)
        self.super_user = UserFactory(is_staff=True, is_superuser=True)

        self.admin_event_query = f"""
            query Event {{
                event(id: {self.attendable_event_with_slot_dist.id}) {{
                    id
                    title
                    attendable {{
                        usersAttending {{
                            id
                        }}
                        usersOnWaitingList {{
                            id
                        }}
                    }}
                }}
            }}
            """

        self.non_attendable_event_update_query = f"""
            mutation {{
                updateEvent(
                    id: {self.non_attendable_event.id}
                    isAttendable: false
                    eventData: {{title: \"Event med ny tittel\" }}
                    ) {{
                        ok
                        event {{
                        id
                    }}
                }}
            }}
            """

        self.delete_event_query = f"""
                mutation {{
                  deleteEvent(id: {self.non_attendable_event.id}) {{
                    ok
                  }}
                }}
                """

        self.create_category_query = """
                mutation CreateCategory {
                    createCategory(
                        categoryData: {
                            name: \"Spennende kategori\",
                            }
                        ) {
                    category {
                        id
                    }
                      ok
                        }
                    }
                """

        self.update_category_query = f"""
                mutation UpdateCategory {{
                    updateCategory(
                        id: {self.first_category.id}
                        categoryData: {{
                            name: \"Kategori med nytt navn\",
                            }}
                        ) {{
                      ok
                        }}
                    }}
                """

        self.delete_category_query = f"""
                mutation DeleteCategory {{
                    deleteCategory( id: {self.first_category.id}) {{
                      ok
                        }}
                    }}
                """

        self.event_signup_query = f"""
                mutation EventSignUp {{
                    eventSignUp(
                        eventId: {self.attendable_and_open_event.id},
                        data: {{ extraInformation: \"\" }}
                        ) {{
                      isFull
                        }}
                    }}
                """

        self.event_signoff_query = f"""
                mutation EventSignOff {{
                    eventSignOff(
                        eventId: {self.attendable_and_open_event.id},
                        ) {{
                      isFull
                        }}
                    }}
                """

        self.admin_event_signoff_query = f"""
                mutation AdminEventSignOff {{
                    adminEventSignOff(
                        eventId: {self.attendable_and_open_event.id},
                        userId: {self.user_3rd_grade.id}
                        ) {{
                      event {{
                          id
                      }}
                        }}
                    }}
                """


class EventsResolversTestCase(EventsBaseTestCase):
    """
    Testing all resolvers for events
    """

    def test_resolve_all_events(self):
        response = self.query(
            """
            query {
                allEvents {
                id
                title
                }
            }
            """,
        )
        # This validates the status code and if you get errors
        self.assertResponseNoErrors(response)
        # Fetching content of response
        content = json.loads(response.content)

        # There are three events in the database
        self.assertEqual(len(content["data"]["allEvents"]), 3)

    def test_resolve_default_events(self):
        response = self.query(
            """
            query {
                defaultEvents {
                id
                title
                }
            }
            """
        )
        # This validates the status code and if you get errors
        self.assertResponseNoErrors(response)
        # Fetching content of response
        content = json.loads(response.content)

        # Since default events returns one event from each organiation,
        # there should be three events
        self.assertEqual(len(content["data"]["defaultEvents"]), 3)

    def test_resolve_event(self):
        # Test regular user
        response = self.query(
            f"""
            query {{
                event(id: {self.non_attendable_event.id}) {{
                    id
                    title
                }}
            }}
            """
        )

        # This validates the status code and if you get errors
        self.assertResponseNoErrors(response)
        # Fetching content of response
        content = json.loads(response.content)

        # The correct event was fetched from the database
        self.deep_assert_equal(content["data"]["event"], self.non_attendable_event)

    def test_invalid_admin_resolve_event_without_organization(self):
        # Test admin user can see the slotDistribution
        # Try to make query without organization membership
        response = self.query(self.admin_event_query, user=self.user_1st_grade)
        content = json.loads(response.content)
        # Check that availableSlots was not included
        self.assertTrue(content["data"]["event"]["attendable"]["usersAttending"] is None)
        self.assertTrue(content["data"]["event"]["attendable"]["usersOnWaitingList"] is None)

    def test_admin_resolve_event_with_organization(self):
        # Test admin user can get see the availableSlots
        # Try to make query with organization membership
        MembershipFactory(user=self.user_1st_grade, organization=self.attendable_event_with_slot_dist.organization)
        response = self.query(self.admin_event_query, user=self.user_1st_grade)
        content = json.loads(response.content)
        self.assertTrue(content["data"]["event"]["attendable"]["usersAttending"] is not None)
        self.assertTrue(content["data"]["event"]["attendable"]["usersOnWaitingList"] is not None)

    def test_resolve_categories(self):
        response = self.query(
            """
            query {
                allCategories {
                  id
                  name
                }
              }
            """,
        )

        # This validates the status code and if you get errors
        self.assertResponseNoErrors(response)
        # Fetching content of response
        content = json.loads(response.content)
        # There are two categories in the database
        self.assertEqual(len(content["data"]["allCategories"]), 2)

    def test_resolve_category(self):
        response = self.query(
            f"""
            query {{
                category(id: {self.first_category.id}) {{
                  id
                  name
                }}
              }}
            """,
        )

        # This validates the status code and if you get errors
        self.assertResponseNoErrors(response)
        # Fetching content of response
        content = json.loads(response.content)
        # The correct category was fetched from the database
        self.deep_assert_equal(content["data"]["category"], self.first_category)


class EventsMutationsTestCase(EventsBaseTestCase):
    """
    Testing all mutations for events
    """

    def create_event(self, event, user=None):
        # Query for creating a non-attendable event
        query = f"""
                mutation CreateEvent {{
                    createEvent(
                        eventData: {{
                            title: \"{event.title}\",
                            description: \"{event.description}\",
                            startTime: \"{event.start_time.strftime("%Y-%m-%dT%H:%M:%S+00:00")}\",
                            endTime:  \"{event.end_time.strftime("%Y-%m-%dT%H:%M:%S+00:00")}\",
                            organizationId: {event.organization.id},
                            allowedGradeYears: [{event.allowed_grade_years_string}],
                            contactEmail: \"{event.contact_email}\"
                            }}
                        ) {{
                    event {{
                        id
                    }}
                      ok
                        }}
                    }}
                """
        return self.query(query, user=user)

    def create_attendable_event(self, event, attendable, slot_distribution, user=None):
        # Query for creating an attendable event

        signup_open_date = None
        if attendable.signup_open_date:
            signup_open_date = attendable.signup_open_date.strftime("%Y-%m-%dT%H:%M:%S+00:00")

        query = f"""
            mutation CreateEvent {{
                createEvent(
                    eventData: {{
                        title: \"{event.title}\",
                        description: \"{event.description}\",
                        startTime: \"{event.start_time.strftime("%Y-%m-%dT%H:%M:%S+00:00")}\",
                        endTime:  \"{event.end_time.strftime("%Y-%m-%dT%H:%M:%S+00:00")}\",
                        organizationId: {event.organization.id},
                        allowedGradeYears: [{event.allowed_grade_years_string}]
                        }},

                    attendableData: {{
                        signupOpenDate: \"{signup_open_date}\",
                        bindingSignup: {"true" if attendable.binding_signup else "false"},
                        deadline: \"{attendable.deadline.strftime("%Y-%m-%dT%H:%M:%S+00:00")}\",
                        totalAvailableSlots: {attendable.total_available_slots},
                        slotDistribution: {slot_distribution}
                        }},
                    ) {{
                event {{
                    id
                }}
                  ok
                    }}
                }}
            """

        return self.query(query, user=user)

    def check_create_event_with_error(self, response):
        self.assertResponseHasErrors(response)
        # Check that event is not created
        self.assertEqual(3, len(Event.objects.all()))

    def check_create_category_with_error(self, response):
        self.assertResponseHasErrors(response)
        # Check that category is not created
        self.assertEqual(2, len(Category.objects.all()))

    def check_create_signup_with_error(self, response):
        self.assertResponseHasErrors(response)
        # Check that signup is not created
        self.assertEqual(0, len(SignUp.objects.all()))

    def test_create_event_withtout_organization(self):
        # Test event creation fails without organization membership
        organization = SimplifiedOrganizationFactory()
        event = EventFactory.build(organization=organization)
        response = self.create_event(event)
        self.assertResponseHasErrors(response)

    def test_create_event_with_organization(self):
        # Test event creation with organization membership
        organization = SimplifiedOrganizationFactory()
        event = EventFactory.build(organization=organization)
        MembershipFactory(user=self.user_1st_grade, organization=organization)
        response = self.create_event(event, user=self.user_1st_grade)
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)
        # Check that event is created
        self.assertTrue(Event.objects.filter(id=int(content["data"]["createEvent"]["event"]["id"])).exists())

    def test_create_attendable_event(self):
        # Test attendable event creation
        organization = SimplifiedOrganizationFactory()
        event = EventFactory.build(organization=organization)
        MembershipFactory(user=self.user_1st_grade, organization=organization)
        attendable = AttendableFactory.build(event=event)
        slot_distribution = '[{gradeGroup: "1,2,3,4,5", availableSlots: 5}]'
        response = self.create_attendable_event(
            event=event, attendable=attendable, slot_distribution=slot_distribution, user=self.user_1st_grade
        )
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)
        # Check that event is created
        self.assertTrue(Event.objects.filter(id=int(content["data"]["createEvent"]["event"]["id"])).exists())

    def test_create_attendable_event_with_slot_distribution(self):
        # Test attendable event with slot distribution creation
        organization = SimplifiedOrganizationFactory()
        event = EventFactory.build(organization=organization, allowed_grade_years="1,2")
        attendable = AttendableFactory.build(event=event, total_available_slots=2, slot_distribution={"1": 1, "2": 1})
        MembershipFactory(user=self.user_1st_grade, organization=organization)
        slot_distribution = '[{gradeGroup: "1", availableSlots: 1}, {gradeGroup: "2", availableSlots: 1}]'
        response = self.create_attendable_event(
            event=event, attendable=attendable, slot_distribution=slot_distribution, user=self.user_1st_grade
        )
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)
        # Check that event is created
        self.assertTrue(Event.objects.filter(id=int(content["data"]["createEvent"]["event"]["id"])).exists())

    def test_add_invalid_start_time(self):
        # Try to add event with start time before current time
        self.non_attendable_event.start_time = timezone.now() - datetime.timedelta(days=5)
        MembershipFactory(user=self.user_1st_grade, organization=self.non_attendable_event.organization)
        response = self.create_event(self.non_attendable_event, user=self.user_1st_grade)
        self.check_create_event_with_error(response)

    def test_add_invalid_end_time(self):
        # Try to add event with end time before start time
        self.non_attendable_event.start_time = timezone.now() + datetime.timedelta(days=10)
        self.non_attendable_event.end_time = timezone.now() + datetime.timedelta(days=5)
        response = self.create_event(self.non_attendable_event, user=self.user_1st_grade)
        self.check_create_event_with_error(response)

    def test_add_invalid_signup_open_date(self):
        # Try to add event with sign up open date before current time
        self.attendable_and_open_event.attendable.signup_open_date = timezone.now() - datetime.timedelta(days=5)
        MembershipFactory(user=self.user_1st_grade, organization=self.attendable_and_open_event.organization)
        slot_distribution = '[{gradeGroup: "1,2,3", availableSlots: 1}]'
        response = self.create_attendable_event(
            event=self.attendable_and_open_event,
            attendable=self.attendable_and_open_event.attendable,
            slot_distribution=slot_distribution,
            user=self.user_1st_grade,
        )
        self.check_create_event_with_error(response)

    def test_add_invalid_deadline(self):
        # Try to add event with deadline before sign up open date
        self.attendable_and_open_event.attendable.signup_open_date = timezone.now() + datetime.timedelta(days=10)
        self.attendable_and_open_event.attendable.deadline = timezone.now() + datetime.timedelta(days=5)
        slot_distribution = '[{gradeGroup: "1,2,3", availableSlots: 1}]'
        response = self.create_attendable_event(
            event=self.attendable_and_open_event,
            attendable=self.attendable_and_open_event.attendable,
            slot_distribution=slot_distribution,
            user=self.user_1st_grade,
        )
        self.check_create_event_with_error(response)

    def test_invalid_email(self):
        self.non_attendable_event.contact_email = "oda.norwegian123.no"
        MembershipFactory(user=self.user_1st_grade, organization=self.non_attendable_event.organization)
        response = self.create_event(self.non_attendable_event, user=self.user_1st_grade)
        self.check_create_event_with_error(response)

    def test_empty_event_title(self):
        # Try to create an event with no title variable
        self.non_attendable_event.title = ""
        MembershipFactory(user=self.user_1st_grade, organization=self.non_attendable_event.organization)
        response = self.create_event(self.non_attendable_event, user=self.user_1st_grade)
        self.check_create_event_with_error(response)

    def test_empty_description(self):
        # Try to create an event with no description variable
        self.non_attendable_event.description = ""
        MembershipFactory(user=self.user_1st_grade, organization=self.non_attendable_event.organization)
        response = self.create_event(self.non_attendable_event, user=self.user_1st_grade)
        self.check_create_event_with_error(response)

    def test_create_attendable_event_without_available_slots(self):
        # Try to create an attenable event without specifying the number of available slots
        MembershipFactory(user=self.user_1st_grade, organization=self.attendable_and_open_event.organization)
        self.attendable_and_open_event.attendable.total_available_slots = None
        slot_distribution = '[{gradeGroup: "1,2,3", availableSlots: 1}]'
        response = self.create_attendable_event(
            event=self.attendable_and_open_event,
            attendable=self.attendable_and_open_event.attendable,
            slot_distribution=slot_distribution,
            user=self.user_1st_grade,
        )
        self.check_create_event_with_error(response)

    def test_create_attendable_event_without_sign_up_open_date(self):
        # Try to create an attenable event without specifying the sign up open date
        MembershipFactory(user=self.user_1st_grade, organization=self.attendable_event_with_slot_dist.organization)
        self.attendable_event_with_slot_dist.attendable.signup_open_date = None
        slot_distribution = '[{gradeGroup: "1,2,3", availableSlots: 1}]'
        response = self.create_attendable_event(
            event=self.attendable_event_with_slot_dist,
            attendable=self.attendable_event_with_slot_dist.attendable,
            slot_distribution=slot_distribution,
            user=self.user_1st_grade,
        )
        self.check_create_event_with_error(response)

    def test_create_attendable_event_with_price_without_binding_singup(self):
        event = self.attendable_event_with_slot_dist
        attendable = self.attendable_event_with_slot_dist.attendable
        slot_distribution = '[{gradeGroup: "1,2,3", availableSlots: 1}]'
        query = f"""
                mutation CreateEvent {{
                    createEvent(
                        eventData: {{
                            title: \"{event.title}\",
                            description: \"{event.description}\",
                            startTime: \"{event.start_time.strftime("%Y-%m-%dT%H:%M:%S+00:00")}\",
                            endTime:  \"{event.end_time.strftime("%Y-%m-%dT%H:%M:%S+00:00")}\",
                            organizationId: {event.organization.id},
                            allowedGradeYears: [{event.allowed_grade_years_string}],
                            }},

                        attendableData: {{
                            signupOpenDate: \"{attendable.signup_open_date.strftime("%Y-%m-%dT%H:%M:%S+00:00")}\",
                            bindingSignup: false,
                            deadline: \"{attendable.deadline.strftime("%Y-%m-%dT%H:%M:%S+00:00")}\",
                            price: 100.0,
                            totalAvailableSlots: {attendable.total_available_slots}
                            slotDistribution: {slot_distribution}
                            }},
                        ) {{
                    event {{
                        id
                    }}
                      ok
                        }}
                    }}
                """
        MembershipFactory(user=self.user_1st_grade, organization=self.attendable_event_with_slot_dist.organization)
        response = self.query(query, user=self.user_1st_grade)
        self.check_create_event_with_error(response)

    def test_invalid_update_event_without_organization(self):
        # Update event without organization membership
        response = self.query(self.non_attendable_event_update_query)
        self.assertResponseHasErrors(response)

    def test_update_event_with_organization(self):
        # Update event with organization membership
        MembershipFactory(user=self.user_1st_grade, organization=self.non_attendable_event.organization)
        response = self.query(self.non_attendable_event_update_query, user=self.user_1st_grade)

        # Fetch updated event and check that update was successful
        self.non_attendable_event = Event.objects.get(pk=self.non_attendable_event.id)
        self.assertResponseNoErrors(response)
        self.assertEqual("Event med ny tittel", self.non_attendable_event.title)

    def test_update_event_make_attendable(self):
        # Make non-attendable event attendable
        signup_open_date = (timezone.now() + datetime.timedelta(days=1)).strftime("%Y-%m-%dT%H:%M:%S+00:00")
        query = f"""
        mutation {{
          updateEvent(
              id: {self.non_attendable_event.id}
              isAttendable: true
              eventData: {{ title: \"{self.non_attendable_event.title}\", allowedGradeYears: [1,2,3,4,5]}}
              attendableData: {{
                  signupOpenDate: \"{signup_open_date}\"
                  totalAvailableSlots: 2
                  slotDistribution: [{{gradeGroup: "1,2,3,4,5", availableSlots: 2}}]
                  }}
              ) {{
            ok
            event {{
              id
            }}
          }}
        }}
        """
        MembershipFactory(user=self.user_1st_grade, organization=self.non_attendable_event.organization)
        response = self.query(query, user=self.user_1st_grade)
        # Fetch updated event and check that update was successful
        self.non_attendable_event = Event.objects.get(pk=self.non_attendable_event.id)
        self.assertResponseNoErrors(response)
        self.assertTrue(self.non_attendable_event.attendable is not None)
        self.assertEqual(len(self.non_attendable_event.attendable.slot_distribution), 1)

    def test_update_event_make_non_attendable(self):
        # Make attendable event non-attendable
        query = f"""
        mutation {{
          updateEvent(
              id: {self.attendable_and_open_event.id}
              isAttendable: false
              eventData: {{ title: \"{self.attendable_and_open_event.title}\"}}
              ) {{
            ok
            event {{
              id
            }}
          }}
        }}
        """
        MembershipFactory(user=self.user_1st_grade, organization=self.attendable_and_open_event.organization)
        response = self.query(query, user=self.user_1st_grade)
        # Fetch updated event and check that update was successful
        self.attendable_and_open_event = Event.objects.get(pk=self.attendable_and_open_event.id)
        self.assertResponseNoErrors(response)
        self.assertFalse(hasattr(self.attendable_and_open_event, "attendable"))

    def test_update_event_add_slot_distribution(self):
        # Add slot distribution to attendable event
        query = f"""
        mutation {{
          updateEvent(
              id: {self.attendable_and_open_event.id}
              isAttendable: true
              eventData: {{ title: \"{self.non_attendable_event.title}\", allowedGradeYears: [1,2,3,4,5]}}
              attendableData: {{
                  totalAvailableSlots: {self.attendable_and_open_event.attendable.total_available_slots},
                  slotDistribution: [
                      {{ gradeGroup: "1,2", availableSlots: 1}},
                      {{ gradeGroup: "3,4,5", availableSlots: 1}}
                      ]
              }}
              ) {{
            ok
            event {{
              id
            }}
          }}
        }}
        """
        MembershipFactory(user=self.user_1st_grade, organization=self.attendable_and_open_event.organization)
        response = self.query(query, user=self.user_1st_grade)
        # Fetch updated event and check that update was successful
        self.attendable_and_open_event = Event.objects.get(pk=self.attendable_and_open_event.id)
        self.assertResponseNoErrors(response)
        self.assertEqual(len(self.attendable_and_open_event.attendable.slot_distribution), 2)

    def test_update_event_remove_slot_distribution(self):
        # Remove slot distribution from attendable event
        query = f"""
        mutation {{
          updateEvent(
              id: {self.attendable_event_with_slot_dist.id}
              isAttendable: true
              eventData: {{ title: \"{self.attendable_event_with_slot_dist.title}\"}}
              attendableData: {{
                  slotDistribution: [{{gradeGroup: "1,2,4", availableSlots: 2}}],
                  totalAvailableSlots: 2
                  }}
              ) {{
            ok
            event {{
              id
            }}
          }}
        }}
        """
        MembershipFactory(user=self.user_1st_grade, organization=self.attendable_event_with_slot_dist.organization)
        response = self.query(query, user=self.user_1st_grade)
        # Fetch updated event and check that update was successful
        self.attendable_event_with_slot_dist = Event.objects.get(pk=self.attendable_event_with_slot_dist.id)
        self.assertResponseNoErrors(response)
        self.assertEqual(len(self.attendable_event_with_slot_dist.attendable.slot_distribution), 1)

    def test_update_event_change_slot_distribution(self):
        # Update slot distribution on attendable event that already has a slot distribution
        query = f"""
        mutation {{
          updateEvent(
              id: {self.attendable_event_with_slot_dist.id}
              isAttendable: true
              eventData: {{ title: \"{self.attendable_event_with_slot_dist.title}\", allowedGradeYears: [1,2,3,4,5]}}
              attendableData: {{
                  totalAvailableSlots: 3,
                  slotDistribution: [
                      {{ gradeGroup: "1,2", availableSlots: 1}},
                      {{ gradeGroup: "3,4", availableSlots: 1}},
                      {{ gradeGroup: "5", availableSlots: 1}}
                      ]
              }}
              ) {{
            ok
            event {{
              id
            }}
          }}
        }}
        """
        MembershipFactory(user=self.user_1st_grade, organization=self.attendable_event_with_slot_dist.organization)
        response = self.query(query, user=self.user_1st_grade)
        # Fetch updated event and check that update was successful
        self.attendable_event_with_slot_dist = Event.objects.get(pk=self.attendable_event_with_slot_dist.id)
        self.assertResponseNoErrors(response)
        self.assertEqual(len(self.attendable_event_with_slot_dist.attendable.slot_distribution), 3)

    def test_invalid_delete_event_without_organization(self):
        response = self.query(self.delete_event_query)

        # Delete event without organization membership
        self.assertResponseHasErrors(response)
        try:
            Event.objects.get(pk=self.non_attendable_event.id)
        except Event.DoesNotExist:
            self.assertTrue(True, "The event was deleted after unauthorized user tried to delete")

    def test_delete_event_with_organization(self):
        # Delete event with organization membership
        MembershipFactory(user=self.user_1st_grade, organization=self.non_attendable_event.organization)
        response = self.query(self.delete_event_query, user=self.user_1st_grade)
        self.assertResponseNoErrors(response)
        with self.assertRaises(Event.DoesNotExist):
            Event.objects.get(pk=self.non_attendable_event.id)

    def test_create_category_without_organization(self):
        # Try without correct permission
        response = self.query(self.create_category_query, user=self.user_1st_grade)
        self.check_create_category_with_error(response)

    def test_create_category_with_organization(self):
        # Try with permission
        response = self.query(self.create_category_query, user=self.super_user)
        self.assertResponseNoErrors(response)
        # Check that category is created
        content = json.loads(response.content)
        self.assertTrue(Category.objects.filter(id=int(content["data"]["createCategory"]["category"]["id"])).exists())

    def test_empty_category_title(self):
        # Try to create a category with no title variable
        query = """
                mutation CreateCategory {
                    createCategory(
                        categoryData: {
                            title: "",
                            }
                        ) {
                      ok
                        }
                    }
                """
        response = self.query(query, user=self.super_user)
        self.check_create_category_with_error(response)

    def test_invalid_update_category_without_permission(self):
        # Test category update
        # Try without correct permission
        response = self.query(self.update_category_query, user=self.user_1st_grade)
        self.assertResponseHasErrors(response)

    def test_update_category_with_permission(self):
        # Test category update
        # Try with permission
        response = self.query(self.update_category_query, user=self.super_user)
        self.assertResponseNoErrors(response)
        # Fetch updated category and check that update was successful
        self.first_category = Category.objects.get(pk=self.first_category.id)
        self.assertResponseNoErrors(response)
        self.assertEqual("Kategori med nytt navn", self.first_category.name)

    def test_invalid_delete_category_without_permission(self):
        # Test category deletion
        # Try without correct permission
        response = self.query(self.delete_category_query, user=self.user_1st_grade)
        self.assertResponseHasErrors(response)

    def test_delete_category_with_permission(self):
        # Test category deletion
        # Try with permission
        response = self.query(self.delete_category_query, user=self.super_user)
        self.assertResponseNoErrors(response)
        with self.assertRaises(Category.DoesNotExist):
            Category.objects.get(pk=self.first_category.id)

    def test_invalid_event_signup_without_permission(self):
        # Test sign up
        # Try without correct permission
        response = self.query(self.event_signup_query, user=self.user_not_indok)
        self.assert_permission_error(response)

    def test_event_signup_with_permission(self):
        # Test sign up
        # Try with correct permission
        response = self.query(self.event_signup_query, user=self.user_1st_grade)
        self.assertResponseNoErrors(response)
        # Check that sign up is created
        content = json.loads(response.content)
        self.assertTrue(SignUp.objects.filter(event=self.attendable_and_open_event, user=self.user_1st_grade).exists())
        # There was only one available slot on the event and it should now be full
        self.assertTrue(content["data"]["eventSignUp"]["isFull"])

    def test_signup_before_open_date(self):
        # Test sign up before sign up open date
        query = f"""
                mutation EventSignUp {{
                    eventSignUp(
                        eventId: {self.attendable_event_with_slot_dist.id},
                        data: {{ extraInformation: \"\" }}
                        ) {{
                      isFull
                        }}
                    }}
                """
        response = self.query(query, user=self.user_1st_grade)
        self.check_create_signup_with_error(response)

    def test_invalid_event_signup(self):
        # Try to sign up to non-attendable event
        query = f"""
                mutation EventSignUp {{
                    eventSignUp(
                        eventId: {self.non_attendable_event.id},
                        data: {{ extraInformation: \"\" }}
                        ) {{
                      isFull
                        }}
                    }}
                """
        response = self.query(query, user=self.user_1st_grade)
        self.check_create_signup_with_error(response)

    def test_invalid_user_grade_signup(self):
        # Try to sign up with not allowed grade year
        query = f"""
                mutation EventSignUp {{
                    eventSignUp(
                        eventId: {self.attendable_and_open_event.id},
                        data: {{ extraInformation: \"\" }}
                        ) {{
                      isFull
                        }}
                    }}
                """
        response = self.query(query, user=self.user_4th_grade)
        self.check_create_signup_with_error(response)

    def test_invalid_event_signoff_without_permission(self):
        # sign up a user to an event
        SignUpFactory(
            event=self.attendable_and_open_event,
            user=self.user_3rd_grade,
            user_email=self.user_3rd_grade.email,
            user_phone_number=self.user_3rd_grade.phone_number,
            user_grade_year=self.user_3rd_grade.grade_year,
        )
        # Test sign off
        # Try without correct permission
        response = self.query(self.event_signoff_query, user=self.user_not_indok)
        self.assert_permission_error(response)

    def test_invalid_event_signoff_wrong_user(self):
        # sign up a user to an event
        SignUpFactory(
            event=self.attendable_and_open_event,
            user=self.user_3rd_grade,
            user_email=self.user_3rd_grade.email,
            user_phone_number=self.user_3rd_grade.phone_number,
            user_grade_year=self.user_3rd_grade.grade_year,
        )
        # Try signing off wrong user, aka a user that is not signed up
        response = self.query(self.event_signoff_query, user=self.user_1st_grade)
        self.assertResponseHasErrors(response)

    def test_event_signoff_with_permission(self):
        # sign up a user to an event
        SignUpFactory(
            event=self.attendable_and_open_event,
            user=self.user_3rd_grade,
            user_email=self.user_3rd_grade.email,
            user_phone_number=self.user_3rd_grade.phone_number,
            user_grade_year=self.user_3rd_grade.grade_year,
        )
        # Try with correct permission and correct user
        response = self.query(self.event_signoff_query, user=self.user_3rd_grade)
        self.assertResponseNoErrors(response)
        # Check that sign up was updated
        content = json.loads(response.content)
        signup = SignUp.objects.get(event=self.attendable_and_open_event, user=self.user_3rd_grade)
        self.assertEqual(signup.is_attending, False)
        # There was only one available slot on the event and it should now be full
        self.assertFalse(content["data"]["eventSignOff"]["isFull"])

    def test_invalid_admin_event_signoff_without_permission(self):
        # sign up a user to an event
        SignUpFactory(
            event=self.attendable_and_open_event,
            user=self.user_3rd_grade,
            user_email=self.user_3rd_grade.email,
            user_phone_number=self.user_3rd_grade.phone_number,
            user_grade_year=self.user_3rd_grade.grade_year,
        )
        # Test sign off by admin user (user that is a member of the event's organization)
        # Try without correct permission
        response = self.query(self.admin_event_signoff_query, user=self.user_2nd_grade)
        self.assertResponseHasErrors(response)

    def test_invalid_admin_event_signoff_wrong_user(self):
        # sign up a user to an event
        SignUpFactory(
            event=self.attendable_and_open_event,
            user=self.user_3rd_grade,
            user_email=self.user_3rd_grade.email,
            user_phone_number=self.user_3rd_grade.phone_number,
            user_grade_year=self.user_3rd_grade.grade_year,
        )
        # Try with wrong user
        invalid_query = f"""
                mutation AdminEventSignOff {{
                    adminEventSignOff(
                        eventId: {self.attendable_and_open_event.id},
                        userId: {self.user_1st_grade.id}
                        ) {{
                      event {{
                          id
                      }}
                        }}
                    }}
                """
        MembershipFactory(user=self.user_2nd_grade, organization=self.attendable_and_open_event.organization)
        response = self.query(invalid_query, user=self.user_2nd_grade)
        self.assertResponseHasErrors(response)

    def test_admin_event_signoff_with_permission(self):
        # sign up a user to an event
        SignUpFactory(
            event=self.attendable_and_open_event,
            user=self.user_3rd_grade,
            user_email=self.user_3rd_grade.email,
            user_phone_number=self.user_3rd_grade.phone_number,
            user_grade_year=self.user_3rd_grade.grade_year,
        )
        # Try with correct permission and correct user
        MembershipFactory(user=self.user_2nd_grade, organization=self.attendable_and_open_event.organization)
        response = self.query(self.admin_event_signoff_query, user=self.user_2nd_grade)
        self.assertResponseNoErrors(response)
        # Check that sign up was updated
        signup = SignUp.objects.get(event=self.attendable_and_open_event, user=self.user_3rd_grade)
        self.assertEqual(signup.is_attending, False)


class EventsMailTestCase(EventsBaseTestCase):
    def setUp(self) -> None:
        super().setUp()

        self.user1 = IndokUserFactory()
        self.user2 = IndokUserFactory()
        self.user3 = IndokUserFactory()
        self.user4 = IndokUserFactory()
        self.event = self.attendable_and_open_event

        self.org_user = IndokUserFactory()
        MembershipFactory(user=self.org_user, organization=self.event.organization)

        # Sign up four users for an event with 1 available slot
        self.query(self.event_signup_query, user=self.user1)
        self.query(self.event_signup_query, user=self.user2)
        self.query(self.event_signup_query, user=self.user3)
        self.query(self.event_signup_query, user=self.user4)

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
            updateEvent(id: {self.event.id}, attendableData: {{ totalAvailableSlots: 3}}) {{
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
