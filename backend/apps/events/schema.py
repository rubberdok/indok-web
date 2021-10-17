import graphene

from .mutations import (
    CreateCategory,
    CreateEvent,
    DeleteCategory,
    DeleteEvent,
    UpdateCategory,
    UpdateEvent,
    EventSignUp,
    EventSignOff,
    AdminEventSignOff,
    SendEventEmails,
)
from .resolvers import EventResolvers
from .types import CategoryType, EventType, SignUpType


class EventMutations(graphene.ObjectType):
    create_event = CreateEvent.Field()
    update_event = UpdateEvent.Field()
    event_sign_up = EventSignUp.Field()
    event_sign_off = EventSignOff.Field()
    admin_event_sign_off = AdminEventSignOff.Field()
    delete_event = DeleteEvent.Field()
    create_category = CreateCategory.Field()
    update_category = UpdateCategory.Field()
    delete_category = DeleteCategory.Field()
    send_event_mails = SendEventEmails.Field()


class EventQueries(graphene.ObjectType, EventResolvers):
    all_events = graphene.List(
        EventType,
        category=graphene.String(required=False),
        organization=graphene.String(required=False),
        start_time=graphene.DateTime(required=False),
        end_time=graphene.DateTime(required=False),
    )
    default_events = graphene.List(EventType)
    event = graphene.Field(EventType, id=graphene.ID(required=True))
    all_categories = graphene.List(CategoryType)
    category = graphene.Field(CategoryType, id=graphene.ID(required=True))
    attendee_report = graphene.String(
        event_id=graphene.ID(required=True),
        fields=graphene.List(graphene.String, required=False),
        filetype=graphene.String(required=False),
    )
    attendee_reports = graphene.String(
        event_ids=graphene.List(graphene.ID, required=True),
        fields=graphene.List(graphene.String),
        filetype=graphene.String(required=False),
    )
    attendee_report_org = graphene.String(
        org_id=graphene.ID(required=True),
        fields=graphene.List(graphene.String),
        filetype=graphene.String(required=False),
    )