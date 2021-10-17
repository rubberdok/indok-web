import json
from django.core import mail
from apps.events.models import Event, Category
from utils.testing.factories.event_factories import (
    EventFactory,
    AttendableFactory,
    CategoryFactory,
    SlotDistributionFactory,
    SignUpFactory,
    SimplifiedOrganizationFactory,
)
from utils.testing.factories.organizations import MembershipFactory
from utils.testing.ExtendedGraphQLTestCase import ExtendedGraphQLTestCase
import datetime
from django.utils import timezone
from utils.testing.factories.users import UserFactory


class EventsBaseTestCase(ExtendedGraphQLTestCase):
    def setUp(self) -> None:
        super().setUp()
        # Create three events
        self.first_event = EventFactory(organization=SimplifiedOrganizationFactory())
        self.second_event = EventFactory(organization=SimplifiedOrganizationFactory())
        self.third_event = EventFactory(organization=SimplifiedOrganizationFactory())

        # Make one attendable without specific slot distribution
        attendable = AttendableFactory(event=self.second_event)
        SlotDistributionFactory(attendable=attendable, available_slots=1)

        # Make one attendable with specific slot distribution
        attendable = AttendableFactory(event=self.third_event)
        parent_slot_dist = SlotDistributionFactory(attendable=attendable, available_slots=2)
        SlotDistributionFactory(
            attendable=attendable, available_slots=1, parent_distribution=parent_slot_dist, grade_years="1, 2"
        )
        SlotDistributionFactory(
            attendable=attendable, available_slots=1, parent_distribution=parent_slot_dist, grade_years="4"
        )

        # Create some categories
        self.first_category = CategoryFactory()
        self.second_category = CategoryFactory()

        # Create (logged in) users
        now = datetime.datetime.now()
        current_year = now.year
        year_val = 5 if now.month < 8 else 6

        self.user_1st_grade = UserFactory(graduation_year=year_val + current_year - 1)
        self.user_2nd_grade = UserFactory(graduation_year=year_val + current_year - 2)
        self.user_3rd_grade = UserFactory(graduation_year=year_val + current_year - 3)
        self.user_4th_grade = UserFactory(graduation_year=year_val + current_year - 4)
        self.super_user = UserFactory(is_staff=True, is_superuser=True)


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
            """,
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
                event(id: {self.first_event.id}) {{
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
        self.assertEqual(int(content["data"]["event"]["id"]), self.first_event.id)
        self.assertEqual(content["data"]["event"]["title"], self.first_event.title)

        # Test admin user
        query = f"""
            query Event {{
                event(id: {self.third_event.id}) {{
                    id
                    title
                    availableSlots {{
                        category
                        availableSlots
                    }}
                }}
            }}
            """
        # Try to make query without organization membership
        response = self.query(query, user=self.user_1st_grade)
        content = json.loads(response.content)
        # Check that availableSlots was not included
        self.assertTrue(content["data"]["event"]["availableSlots"] is None)

        # Try to make query with organization membership
        MembershipFactory(user=self.user_1st_grade, organization=self.third_event.organization)
        response = self.query(query, user=self.user_1st_grade)
        content = json.loads(response.content)
        self.assertTrue(content["data"]["event"]["availableSlots"] is not None)

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
        self.assertEqual(int(content["data"]["category"]["id"]), self.first_category.id)
        self.assertEqual(content["data"]["category"]["name"], self.first_category.name)


class EventsMutationsTestCase(EventsBaseTestCase):
    """
    Testing all mutations for events
    """

    def create_event(self, event, user=None):
        query = f"""
                mutation CreateEvent {{
                    createEvent(
                        eventData: {{
                            title: \"{event.title}\",
                            description: \"{event.description}\",
                            startTime: \"{event.start_time.strftime("%Y-%m-%dT%H:%M:%S+00:00")}\",
                            endTime:  \"{event.end_time.strftime("%Y-%m-%dT%H:%M:%S+00:00")}\",     
                            organizationId: {event.organization.id},
                            allowedGradeYears: {[int(grade) for grade in event.allowed_grade_years.split(",")]},
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
        query = ""

        if event is not None and attendable is not None and slot_distribution is not None:
            grade_years_string = self.stringify_grade_years(slot_distribution)
            query = f"""
                mutation CreateEvent {{
                    createEvent(
                        eventData: {{
                            title: \"{event.title}\",
                            description: \"{event.description}\",
                            startTime: \"{event.start_time.strftime("%Y-%m-%dT%H:%M:%S+00:00")}\",
                            endTime:  \"{event.end_time.strftime("%Y-%m-%dT%H:%M:%S+00:00")}\",     
                            organizationId: {event.organization.id},
                            allowedGradeYears: {[int(grade) for grade in event.allowed_grade_years.split(",")]},
                            }},

                        attendableData: {{
                            signupOpenDate: \"{attendable.signup_open_date.strftime("%Y-%m-%dT%H:%M:%S+00:00")}\",
                            bindingSignup: {"true" if attendable.binding_signup else "false"},
                            deadline: \"{attendable.deadline.strftime("%Y-%m-%dT%H:%M:%S+00:00")}\",    
                            }},
                            
                        slotDistributionData: {{
                            availableSlots: {slot_distribution.available_slots},
                            gradeYears: {grade_years_string},                        
                            }}

                        ) {{
                    event {{
                        id
                    }}
                      ok
                        }}
                    }}
                """

        elif attendable is None:
            grade_years_string = self.stringify_grade_years(slot_distribution)
            query = f"""
                mutation CreateEvent {{
                    createEvent(
                         eventData: {{
                            title: \"{event.title}\",
                            description: \"{event.description}\",
                            startTime: \"{event.start_time.strftime("%Y-%m-%dT%H:%M:%S+00:00")}\",
                            endTime:  \"{event.end_time.strftime("%Y-%m-%dT%H:%M:%S+00:00")}\",    
                            organizationId: {event.organization.id},
                            allowedGradeYears: {[int(grade) for grade in event.allowed_grade_years.split(",")]},
                            }},

                        slotDistributionData: {{
                            availableSlots: {slot_distribution.available_slots},
                            gradeYears: {grade_years_string},                        
                            }}

                        ) {{
                    event {{
                        id
                    }}
                      ok
                        }}
                    }}
                """

        elif slot_distribution is None:
            query = f"""
                mutation CreateEvent {{
                    createEvent(
                         eventData: {{
                            title: \"{event.title}\",
                            description: \"{event.description}\",
                            startTime: \"{event.start_time.strftime("%Y-%m-%dT%H:%M:%S+00:00")}\",
                            endTime:  \"{event.end_time.strftime("%Y-%m-%dT%H:%M:%S+00:00")}\", 
                            organizationId: {event.organization.id},
                            allowedGradeYears: {[int(grade) for grade in event.allowed_grade_years.split(",")]},
                            }},
                            
                        attendableData: {{
                            signupOpenDate: \"{attendable.signup_open_date.strftime("%Y-%m-%dT%H:%M:%S+00:00")}\",
                            bindingSignup: {"true" if attendable.binding_signup else "false"},
                            deadline: \"{attendable.deadline.strftime("%Y-%m-%dT%H:%M:%S+00:00")}\",    
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
        content = json.loads(response.content)
        assert "errors" in content
        # Check that event is not created
        self.assertEqual(3, len(Event.objects.all()))

    def check_create_category_with_error(self, response):
        content = json.loads(response.content)
        assert "errors" in content
        # Check that category is not created
        self.assertEqual(2, len(Category.objects.all()))

    def stringify_grade_years(self, slot_distribution):
        grade_years = slot_distribution.get_available_slots()
        grade_years_string = "["
        for dist in grade_years:
            grade_years_string += f"{{category: \"{dist['category']}\", availableSlots: {dist['available_slots']}}},"
        grade_years_string = grade_years_string[0:-1] + "]"
        return grade_years_string

    def test_create_event(self):
        # Test event creation fails without organization membership
        organization = SimplifiedOrganizationFactory()
        event = EventFactory.build(organization=organization)
        response = self.create_event(event)
        content = json.loads(response.content)
        assert "errors" in content

        # Test event creation with organization membership
        MembershipFactory(user=self.user_1st_grade, organization=organization)
        response = self.create_event(event, user=self.user_1st_grade)
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)
        # Check that event is created
        self.assertTrue(Event.objects.filter(id=int(content["data"]["createEvent"]["event"]["id"])).exists())

        # Test attendable event creation
        event = EventFactory.build(organization=organization)
        attendable = AttendableFactory.build(event=event)
        slot_distribution = SlotDistributionFactory.build(attendable=attendable, available_slots=1)
        response = self.create_attendable_event(
            event=event, attendable=attendable, slot_distribution=slot_distribution, user=self.user_1st_grade
        )
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)
        # Check that event is created
        self.assertTrue(Event.objects.filter(id=int(content["data"]["createEvent"]["event"]["id"])).exists())

        # Test attendable event with slot distribution creation
        event = EventFactory.build(organization=organization)
        attendable = AttendableFactory.build(event=event)
        slot_distribution = SlotDistributionFactory.build(attendable=attendable, available_slots=2)
        SlotDistributionFactory.build(
            attendable=attendable, available_slots=1, parent_distribution=slot_distribution, grade_years="1"
        )
        SlotDistributionFactory.build(
            attendable=attendable, available_slots=1, parent_distribution=slot_distribution, grade_years="2"
        )
        response = self.create_attendable_event(
            event=event, attendable=attendable, slot_distribution=slot_distribution, user=self.user_1st_grade
        )
        self.assertResponseNoErrors(response)
        content = json.loads(response.content)
        # Check that event is created
        self.assertTrue(Event.objects.filter(id=int(content["data"]["createEvent"]["event"]["id"])).exists())

    def test_add_invalid_times(self):
        # Try to add event with start time before current time
        self.first_event.start_time = timezone.now() - datetime.timedelta(days=5)
        MembershipFactory(user=self.user_1st_grade, organization=self.first_event.organization)
        response = self.create_event(self.first_event, user=self.user_1st_grade)
        self.check_create_event_with_error(response)

        # Try to add event with end time before start time
        self.first_event.start_time = timezone.now() + datetime.timedelta(days=10)
        self.first_event.end_time = timezone.now() + datetime.timedelta(days=5)
        response = self.create_event(self.first_event, user=self.user_1st_grade)
        self.check_create_event_with_error(response)

        # Try to add event with sign up open date before current time
        self.second_event.attendable.signup_open_date = timezone.now() - datetime.timedelta(days=5)
        MembershipFactory(user=self.user_1st_grade, organization=self.second_event.organization)
        response = self.create_attendable_event(
            self.second_event,
            self.second_event.attendable,
            self.second_event.attendable.slot_distribution.get(parent_distribution=None),
            user=self.user_1st_grade,
        )
        self.check_create_event_with_error(response)

        # Try to add event with deadline before sign up open date
        self.second_event.attendable.signup_open_date = timezone.now() + datetime.timedelta(days=10)
        self.second_event.attendable.deadline = timezone.now() + datetime.timedelta(days=5)
        response = self.create_attendable_event(
            self.second_event,
            self.second_event.attendable,
            self.second_event.attendable.slot_distribution.get(parent_distribution=None),
            user=self.user_1st_grade,
        )
        self.check_create_event_with_error(response)

    def test_invalid_email(self):
        self.first_event.contact_email = "oda.norwegian123.no"
        MembershipFactory(user=self.user_1st_grade, organization=self.first_event.organization)
        response = self.create_event(self.first_event, user=self.user_1st_grade)
        self.check_create_event_with_error(response)

    def test_empty_title(self):
        # Try to create an event with no title variable
        self.first_event.title = ""
        MembershipFactory(user=self.user_1st_grade, organization=self.first_event.organization)
        response = self.create_event(self.first_event, user=self.user_1st_grade)
        self.check_create_event_with_error(response)

    def test_empty_description(self):
        # Try to create an event with no description variable
        self.first_event.description = ""
        MembershipFactory(user=self.user_1st_grade, organization=self.first_event.organization)
        response = self.create_event(self.first_event, user=self.user_1st_grade)
        self.check_create_event_with_error(response)

    def test_create_attendable_event_without_available_slots(self):
        # Try to create an attenable event without specifying the number of available slots
        MembershipFactory(user=self.user_1st_grade, organization=self.second_event.organization)
        response = self.create_attendable_event(
            event=self.second_event,
            attendable=self.second_event.attendable,
            slot_distribution=None,
            user=self.user_1st_grade,
        )
        self.check_create_event_with_error(response)

    def test_create_attendable_event_without_sign_up_open_date(self):
        # Try to create an attenable event without specifying the sign up open date
        MembershipFactory(user=self.user_1st_grade, organization=self.third_event.organization)
        response = self.create_attendable_event(
            event=self.third_event,
            attendable=None,
            slot_distribution=self.third_event.attendable.slot_distribution.get(parent_distribution=None),
            user=self.user_1st_grade,
        )
        self.check_create_event_with_error(response)

    def test_create_attendable_event_with_price_wihtout_binding_singup(self):
        event = self.third_event
        attendable = self.third_event.attendable
        slot_distribution = self.third_event.attendable.slot_distribution.get(parent_distribution=None)
        grade_years_string = self.stringify_grade_years(slot_distribution)
        query = f"""
                mutation CreateEvent {{
                    createEvent(
                        eventData: {{
                            title: \"{event.title}\",
                            description: \"{event.description}\",
                            startTime: \"{event.start_time.strftime("%Y-%m-%dT%H:%M:%S+00:00")}\",
                            endTime:  \"{event.end_time.strftime("%Y-%m-%dT%H:%M:%S+00:00")}\",     
                            organizationId: {event.organization.id},
                            allowedGradeYears: {[int(grade) for grade in event.allowed_grade_years.split(",")]},
                            }},

                        attendableData: {{
                            signupOpenDate: \"{attendable.signup_open_date.strftime("%Y-%m-%dT%H:%M:%S+00:00")}\",
                            bindingSignup: false,
                            deadline: \"{attendable.deadline.strftime("%Y-%m-%dT%H:%M:%S+00:00")}\",    
                            price: 100.0
                            }},
                            
                        slotDistributionData: {{
                            availableSlots: {slot_distribution.available_slots},
                            gradeYears: {grade_years_string},                        
                            }}

                        ) {{
                    event {{
                        id
                    }}
                      ok
                        }}
                    }}
                """
        MembershipFactory(user=self.user_1st_grade, organization=self.third_event.organization)
        response = self.query(query, user=self.user_1st_grade)
        self.check_create_event_with_error(response)

    def test_update_event(self):
        # General update
        query = f"""
        mutation {{
          updateEvent(
              id: {self.first_event.id} 
              isAttendable: false
              hasGradeDistributions: false
              eventData: {{title: \"Event med ny tittel\" }}
              ) {{
            ok
            event {{
              id
            }}
          }}
        }}
        """

        # Update event without organization membership
        response = self.query(query)
        content = json.loads(response.content)
        assert "errors" in content

        # Update event with organization membership
        MembershipFactory(user=self.user_1st_grade, organization=self.first_event.organization)
        response = self.query(query, user=self.user_1st_grade)

        # Fetch updated event and check that update was successful
        self.first_event = Event.objects.get(pk=self.first_event.id)
        self.assertResponseNoErrors(response)
        self.assertEqual("Event med ny tittel", self.first_event.title)

        # Make non-attendable event attendable
        query = f"""
        mutation {{
          updateEvent(
              id: {self.first_event.id} 
              isAttendable: true
              hasGradeDistributions: false
              eventData: {{ title: \"{self.first_event.title}\"}}
              attendableData: {{signupOpenDate: \"{(timezone.now() + datetime.timedelta(days=1)).strftime("%Y-%m-%dT%H:%M:%S+00:00")}\"}}
              slotDistributionData: {{availableSlots: {2}, gradeYears: {{category: \"1,2,3,4,5\", availableSlots: 2}} }}
              ) {{
            ok
            event {{
              id
            }}
          }}
        }}
        """
        response = self.query(query, user=self.user_1st_grade)
        # Fetch updated event and check that update was successful
        self.first_event = Event.objects.get(pk=self.first_event.id)
        self.assertResponseNoErrors(response)
        self.assertTrue(self.first_event.attendable is not None)
        self.assertEqual(len(self.first_event.available_slots), 1)

        # Make attendable event non-attendable
        query = f"""
        mutation {{
          updateEvent(
              id: {self.first_event.id} 
              isAttendable: false
              hasGradeDistributions: false
              eventData: {{ title: \"{self.first_event.title}\"}}
              ) {{
            ok
            event {{
              id
            }}
          }}
        }}
        """
        response = self.query(query, user=self.user_1st_grade)
        # Fetch updated event and check that update was successful
        self.first_event = Event.objects.get(pk=self.first_event.id)
        self.assertResponseNoErrors(response)
        self.assertFalse(hasattr(self.first_event, "attendable"))
        self.assertTrue(self.first_event.available_slots is None)

        # Add slot distribution to attendable event
        query = f"""
        mutation {{
          updateEvent(
              id: {self.second_event.id} 
              isAttendable: true
              hasGradeDistributions: true
              eventData: {{ title: \"{self.second_event.title}\"}}
              slotDistributionData: {{ availableSlots: {2}, gradeYears: [{{category: "1,2", availableSlots: 1}}, {{category: "3,4,5", availableSlots: 1}}] }}
              ) {{
            ok
            event {{
              id
            }}
          }}
        }}
        """
        MembershipFactory(user=self.user_1st_grade, organization=self.second_event.organization)
        response = self.query(query, user=self.user_1st_grade)
        # Fetch updated event and check that update was successful
        self.second_event = Event.objects.get(pk=self.second_event.id)
        self.assertResponseNoErrors(response)
        self.assertEqual(len(self.second_event.available_slots), 2)

        # Remove slot distribution from attendable event
        query = f"""
        mutation {{
          updateEvent(
              id: {self.second_event.id} 
              isAttendable: true
              hasGradeDistributions: false
              eventData: {{ title: \"{self.second_event.title}\"}}
              ) {{
            ok
            event {{
              id
            }}
          }}
        }}
        """
        response = self.query(query, user=self.user_1st_grade)
        # Fetch updated event and check that update was successful
        self.second_event = Event.objects.get(pk=self.second_event.id)
        self.assertResponseNoErrors(response)
        self.assertEqual(len(self.second_event.available_slots), 1)

        # Update slot distribution on attendable event that already has a slot distribution
        query = f"""
        mutation {{
          updateEvent(
              id: {self.third_event.id} 
              isAttendable: true
              hasGradeDistributions: true
              eventData: {{ title: \"{self.third_event.title}\"}}
              slotDistributionData: {{ availableSlots: {3}, gradeYears: [{{category: "1,2", availableSlots: 1}}, {{category: "3,4", availableSlots: 1}}, {{category: "5", availableSlots: 1}}] }}
              ) {{
            ok
            event {{
              id
            }}
          }}
        }}
        """
        MembershipFactory(user=self.user_1st_grade, organization=self.third_event.organization)
        response = self.query(query, user=self.user_1st_grade)
        # Fetch updated event and check that update was successful
        self.third_event = Event.objects.get(pk=self.third_event.id)
        self.assertResponseNoErrors(response)
        self.assertEqual(len(self.third_event.available_slots), 3)

    def test_delete_event(self):
        query = f"""
                mutation {{
                  deleteEvent(id: {self.first_event.id}) {{
                    ok
                  }}
                }}
                """
        response = self.query(query)

        # Delete event without organization membership
        content = json.loads(response.content)
        assert "errors" in content
        try:
            Event.objects.get(pk=self.first_event.id)
        except Event.DoesNotExist:
            self.assertTrue(True, "The event was deleted after unauthorized user tried to delete")

        # Delete event with organization membership
        MembershipFactory(user=self.user_1st_grade, organization=self.first_event.organization)
        response = self.query(query, user=self.user_1st_grade)
        self.assertResponseNoErrors(response)
        with self.assertRaises(Event.DoesNotExist):
            Event.objects.get(pk=self.first_event.id)

    def test_create_category(self):
        # Test category creation
        query = f"""
                mutation CreateCategory {{
                    createCategory(
                        categoryData: {{
                            name: \"Spennende kategori\",
                            }}
                        ) {{
                    category {{
                        id
                    }}
                      ok
                        }}
                    }}
                """
        # Try without correct permission
        response = self.query(query)
        self.check_create_category_with_error(response)

        # Try with permission
        response = self.query(query, user=self.super_user)
        self.assertResponseNoErrors(response)
        # Check that booking is created
        content = json.loads(response.content)
        self.assertTrue(Category.objects.filter(id=int(content["data"]["createCategory"]["category"]["id"])).exists())

    def test_empty_name(self):
        # Try to create a category with no name variable
        query = f"""
                mutation CreateCategory {{
                    createCategory(
                        categoryData: {{
                            title: \"\",
                            }}
                        ) {{
                      ok
                        }}
                    }}
                """
        response = self.query(query, user=self.super_user)
        self.check_create_category_with_error(response)

    def test_update_category(self):
        # Test category update
        query = f"""
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
        # Try without correct permission
        response = self.query(query)
        content = json.loads(response.content)
        assert "errors" in content

        # Try with permission
        response = self.query(query, user=self.super_user)
        self.assertResponseNoErrors(response)
        # Fetch updated category and check that update was successful
        self.first_category = Category.objects.get(pk=self.first_category.id)
        self.assertResponseNoErrors(response)
        self.assertEqual("Kategori med nytt navn", self.first_category.name)

    def test_delete_category(self):
        # Test category deletion
        query = f"""
                mutation DeleteCategory {{
                    deleteCategory( id: {self.first_category.id}) {{
                      ok
                        }}
                    }}
                """
        # Try without correct permission
        response = self.query(query)
        content = json.loads(response.content)
        assert "errors" in content

        # Try with permission
        response = self.query(query, user=self.super_user)
        self.assertResponseNoErrors(response)
        with self.assertRaises(Category.DoesNotExist):
            Category.objects.get(pk=self.first_category.id)

    # Test create, update and delete sign up


'''
    def test_resolve_sign_ups(self):
        # signUp a user to an attendable event
        SignUpFactory(
            event=self.second_event,
            user=self.user_3rd_grade,
            user_email=self.user_3rd_grade.email,
            user_phone_number=self.user_3rd_grade.phone_number,
            user_grade_year=self.user_3rd_grade.grade_year,
        )

        query = f"""
            query {{
                signUps(eventId: {self.second_event.id}) {{
                  id
                }}
              }}
            """

        # Try to make query without permission
        response = self.query(query, user=self.user_2nd_grade)
        # This validates the status code and if you get errors
        content = json.loads(response.content)
        assert "errors" in content

        # Try to make query with permission
        MembershipFactory(user=self.user_2nd_grade, organization=self.second_event.organization)
        response = self.query(query, user=self.user_2nd_grade)

        content = json.loads(response.content)
        print("\n\n\n", content["errors"], "\n\n\n")
        # [{'message': 'Received incompatible instance "<QuerySet [<SignUp: user27-event17>]>".'}]
        
        self.assertResponseNoErrors(response)

        # Fetching content of response
        content = json.loads(response.content)

        # There should be one signUp in the database
        self.assertEqual(len(content["data"]["signUps"]), 1)
'''


# class EmailTestCase(EventsBaseTestCase):
# TODO: Johan
# Se test.py i cabins for å se hvordan det er gjort i hyttebooking
