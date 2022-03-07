import base64
import io
import json
from collections import namedtuple
from django.utils import timezone
from typing import Union

import pandas as pd
from django.db.models import Q

from apps.ecommerce.models import Order

from ..organizations.models import Organization
from ..organizations.permissions import check_user_membership
from .models import Category, Event, SignUp


DEFAULT_REPORT_FIELDS = {
    "signup_timestamp",
    "event_title",
    "user_first_name",
    "user_last_name",
    "signup_user_grade_year",
    "signup_user_email",
    "signup_user_phone_number",
    "user_allergies",
    "attendance_status",
    "order_timestamp",
    "has_paid",
    "order_id",
    "order_quantity",
    "order_total_price",
}

FiletypeSpec = namedtuple("FiletypeSpec", ["content_type", "extension"])
filetype_specs = {
    "xlsx": FiletypeSpec(
        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        extension="xlsx",
    ),
    "csv": FiletypeSpec(content_type="text/csv", extension="csv"),
    "html": FiletypeSpec(content_type="text/html", extension="html"),
}


class EventResolvers:
    def resolve_all_events(self, info, category=None, organization=None, start_time=None, end_time=None):
        """
        Get all events that fit the given filters
        """
        if category or organization or start_time or end_time:
            filteredEvents = Event.objects

            if start_time and end_time:
                filteredEvents = filteredEvents.filter(start_time__range=(start_time, end_time))

            elif start_time:
                filteredEvents = filteredEvents.filter(start_time__gte=(start_time))

            elif end_time:
                filteredEvents = filteredEvents.filter(start_time__lte=(end_time))

            queries = []
            kwargs = {}
            if category is not None:
                kwargs["category__name"] = category

            # For generalization, if more filters are added later
            new_kwargs = {f"{k}__icontains": v for k, v in kwargs.items()}
            queries = [Q(**{k: v}) for k, v in new_kwargs.items()]

            if organization:  # for organizations, check if the organization argument corresponds to either
                queries.append(  # the organization of the event itself and the parent organization (if it exists)
                    Q(organization__name__icontains=organization)
                    | Q(organization__parent__name__icontains=organization)
                )

            return (
                filteredEvents.filter(*queries)
                .filter(start_time__gte=timezone.now())  # Only show events that have yet to pass
                .order_by("start_time")
            )
        return Event.objects.filter(start_time__gte=timezone.now()).order_by("start_time")

    def resolve_default_events(self, info):
        """
        For each organization, get the most recent (future) event
        """
        # This must be done in 2 queries due to using "distinct"
        event_ids = (
            Event.objects.filter(start_time__gte=timezone.now())
            .order_by("organization", "start_time")
            .distinct("organization")
        )
        return Event.objects.filter(id__in=event_ids).order_by("start_time")

    def resolve_event(self, info, id):
        try:
            return Event.objects.get(id=id)
        except Event.DoesNotExist:
            return None

    def resolve_all_categories(self, info):
        return Category.objects.all()

    def resolve_category(self, info, id):
        try:
            return Category.objects.get(id=id)
        except Category.DoesNotExist:
            return None

    def resolve_attendee_report(self, info, event_id, fields=None, filetype="xlsx"):
        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            return None
        check_user_membership(info.context.user, event.organization)

        df = create_attendee_report([event_id], fields)
        file_basename = f"attendee_report__eventid_{event_id}"
        return wrap_attendee_report_as_json(df, file_basename, filetype)

    def resolve_attendee_reports(self, info, event_ids, fields=None, filetype="xlsx"):
        for event_id in event_ids:
            try:
                event = Event.objects.get(id=event_id)
            except Event.DoesNotExist:
                return None
            check_user_membership(info.context.user, event.organization)

        df = create_attendee_report(event_ids, fields)
        file_basename = f"attendee_report__eventid_{'|'.join(str(id_) for id_ in event_ids)}"
        return wrap_attendee_report_as_json(df, file_basename, filetype)

    def resolve_attendee_report_org(self, info, org_id, fields=None, filetype="xlsx"):
        try:
            org = Organization.objects.get(id=org_id)
        except Organization.DoesNotExist:
            return None
        check_user_membership(info.context.user, org)

        event_ids = Organization.objects.get(id=org_id).events.values_list("id", flat=True)
        df = create_attendee_report(event_ids, fields)
        file_basename = f"attendee_report__orgid_{org_id}"
        return wrap_attendee_report_as_json(df, file_basename, filetype)


def export_single_event(event_id: int, fields: Union[list[str], set[str]]) -> pd.DataFrame:
    event: Event = Event.objects.get(pk=event_id)
    attending_users = event.signed_up_users[: event.available_slots]
    wait_list = event.signed_up_users[event.available_slots :]
    sign_ups = SignUp.objects.filter(event_id=event_id, is_attending=True)

    df_users = pd.DataFrame(
        columns=[
            "user_first_name",
            "user_last_name",
            "user_allergies",
        ]
    )

    if attending_users.exists():
        df_users_attending = pd.DataFrame(attending_users.values()).set_index("id").add_prefix("user_")
        df_users_attending["attendance_status"] = "ATTENDING"
        df_users = pd.concat([df_users, df_users_attending])

    if wait_list.exists():
        df_users_wait_list = pd.DataFrame(wait_list.values()).set_index("id").add_prefix("user_")
        df_users_wait_list["attendance_status"] = "WAIT LIST"

        df_users = pd.concat([df_users, df_users_wait_list])

    if event.products.exists():
        product = event.products.first()
        orders = Order.objects.filter(product=product)
        df_orders = pd.DataFrame(orders.values()).set_index("user_id").add_prefix("order_")
        df_users = df_users.join(df_orders)
        payment_successful = df_users["order_payment_status"] == Order.PaymentStatus.CAPTURED
        df_users["has_paid"] = payment_successful

    df_sign_ups = (
        pd.DataFrame(sign_ups.order_by("timestamp").values())
        .add_prefix("signup_")
        .rename(columns={"signup_event_id": "event_id", "signup_user_id": "user_id"})
    )

    df_joined = df_sign_ups.join(df_users, on="user_id").sort_values(["event_id", "user_id"])
    df_joined["event_title"] = event.title

    if df_joined.empty:
        return pd.DataFrame()

    report_fields = list(DEFAULT_REPORT_FIELDS.intersection(df_joined.columns))
    fields = set(fields).intersection(report_fields) if fields is not None else report_fields

    return df_joined.loc[:, report_fields].drop("password", errors="ignore", axis=1).loc[:, fields]


def create_attendee_report(event_ids, fields):
    df = pd.DataFrame()
    for event_id in event_ids:
        df = pd.concat([df, export_single_event(event_id, fields)])

    return df


def wrap_attendee_report_as_json(df, file_basename, filetype):
    # Handle different content types
    if filetype == "xlsx":
        if "signup_timestamp" in df:
            df["signup_timestamp"] = df["signup_timestamp"].apply(lambda a: pd.to_datetime(a).tz_localize(None))
        if "order_timestamp" in df:
            df["order_timestamp"] = df["order_timestamp"].apply(lambda a: pd.to_datetime(a).tz_localize(None))
        buffer = io.BytesIO()
        with pd.ExcelWriter(buffer, engine="xlsxwriter", options={"remove_timezone": True}) as writer:
            df.to_excel(writer, index=False)
        data = base64.b64encode(buffer.getvalue()).decode("utf-8")
    elif filetype == "csv":
        data = df.to_csv(index=False)
    elif filetype == "html":
        data = df.to_html(index=False)
    else:
        raise ValueError(f"Filetype not supported: '{filetype}'")

    spec = filetype_specs[filetype]
    response = {
        "data": data,
        "filename": f"{file_basename}.{spec.extension}",
        "contentType": spec.content_type,
    }
    return json.dumps(response)
