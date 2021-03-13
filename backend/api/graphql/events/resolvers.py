from apps.events.models import Category, Event
from apps.organizations.models import Organization
from django.db.models import Q
from django.http import HttpResponse
from datetime import date
import pandas as pd
import json
import io

from collections import namedtuple
import base64


DEFAULT_REPORT_FIELDS = ['users__username', 'users__first_name', 'users__last_name', 'users__email', 'users__year']

FiletypeSpec = namedtuple('Filetype', ['content_type', 'extension'])
filetype_specs = {
    "xlsx": FiletypeSpec(content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                         extension="xlsx"),
    "csv": FiletypeSpec(content_type="text/csv",
                         extension="csv"),
    "html": FiletypeSpec(content_type="text/html",
                         extension="html"),
}


class EventResolvers:
    def resolve_all_events(
        parent, info, category=None, organization=None, start_time=None, end_time=None
    ):
        string_names = ["category", "example_filter_1", "example_filter_2"]
        kwargs = {
            f"{string_names[i]}": element
            for i, element in enumerate([category])
            if element != None
        }
        if kwargs or organization or start_time or end_time:
            filteredEvents = Event.objects

            if start_time and end_time:
                filteredEvents = filteredEvents.filter(
                    start_time__range=(start_time, end_time)
                )

            elif start_time:
                filteredEvents = filteredEvents.filter(start_time__gte=(start_time))

            elif end_time:
                filteredEvents = filteredEvents.filter(start_time__lte=(end_time))

            queries = []
            if category != None:
                kwargs["category__name"] = category
                del kwargs["category"]

            new_kwargs = {f"{k}__icontains": v for k, v in kwargs.items()}
            queries = [Q(**{k: v}) for k, v in new_kwargs.items()]

            if organization:
                queries.append(
                    Q(organization__name__icontains=organization)
                    | Q(organization__parent__name__icontains=organization)
                )

            return (
                filteredEvents.filter(*queries)
                .filter(start_time__gte=date.today())
                .order_by("start_time")
            )
        return Event.objects.filter(start_time__gte=date.today()).order_by("start_time")

    def resolve_default_events(parent, info):
        organizations = Organization.objects.all()
        all_events = Event.objects.filter(start_time__gte=date.today())
        events = []
        for organization in organizations:
            try:
                first_matching_event = all_events.get(organization=organization)
                events.append(first_matching_event.id)
            except:
                pass
        return Event.objects.filter(id__in=events).order_by("start_time")

    def resolve_event(parent, info, id):
        try:
            return Event.objects.get(id=id)
        except Event.DoesNotExist:
            return None

    def resolve_all_categories(parent, info):
        return Category.objects.all()

    def resolve_category(parent, info, id):
        try:
            return Category.objects.get(id=id)
        except Category.DoesNotExist:
            return None


    def resolve_attendee_report(parent, info, id, fields=None, filetype='csv'):
        fields = DEFAULT_REPORT_FIELDS if fields is None else fields
        df = create_attendee_report(id, fields)
        file_basename = f"attendee_report_{id}"
        return wrap_attendee_report_json(df, file_basename, filetype)

    def resolve_attendee_report_org(parent, info, ids, fields=None, filetype='xlsx'):
        fields = DEFAULT_REPORT_FIELDS if fields is None else fields
        df = pd.concat([create_attendee_report(id, fields) for id in ids])
        filename = f"attendee_report_{'|'.join(str(id) for id in ids)}.csv"

        fields = DEFAULT_REPORT_FIELDS if fields is None else fields
        event_ids = next(iter(Organization.objects.get(id=1).event_set.values_list("id")), [])
        df = create_attendee_report(id, fields)
        file_basename = f"attendee_report_{'|'.join(str(id) for id in ids)}"
        return wrap_attendee_report_json(df, file_basename, filetype)


def create_attendee_report(id, fields):
    #df_events = pd.DataFrame.from_records(Event.objects.filter(id__in=ids))
    #df_users = pd.DataFrame.from_records(User.objects.filter(id__in=ids))
    #df_joined = df_events_users.join(df_events.set_index('id').add_prefix('events__'), on='user_id')
#                           .join(df_users.set_index('id').add_prefix('users__'), on='event_id')

    #event_id = 
    query_set = Event.objects.get(id=id).signed_up_users.all().values()
    if query_set:
        return pd.DataFrame.from_records(query_set) \
                           .add_prefix('users__') \
                           .loc[:, DEFAULT_REPORT_FIELDS] \
                           .drop('password', errors='ignore', axis=1) \
                           .loc[:, fields]
    return pd.DataFrame()


def wrap_attendee_report_json(df, file_basename, filetype):
    # Handle different content types
    if filetype == "xlsx":
        buffer = io.BytesIO()
        with pd.ExcelWriter(buffer, engine='xlsxwriter', options={'remove_timezone': True}) as writer:
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
        "contentType": spec.content_type
    }
    return json.dumps(response)


def create_attendee_report_org(id_, fields):
    query_set = Event.objects.get(id=id_).signed_up_users.all().values()
    if query_set:
        return pd.DataFrame.from_records(query_set) \
                           .loc[:, DEFAULT_REPORT_FIELDS] \
                           .drop('password', errors='ignore', axis=1) \
                           .loc[:, fields]
    return pd.DataFrame()

qs = Organization.objects.get(id=1).event_set.all().values_list("id", "title", "start_time")