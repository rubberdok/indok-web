from apps.events.models import Category, Event
from apps.organizations.models import Organization
from django.db.models import Q
from django.http import HttpResponse
from datetime import date
import pandas as pd


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

    def resolve_csv_attendee_export(parent, info, id, columns=None):
        columns = DEFAULT_REPORT_COLUMNS if columns is None else columns
        df = create_attendee_report(id, columns)
        return to_csv_response(df, filename=f"attendee_report_{id}.csv")

    def resolve_csv_attendee_exports(parent, info, ids, columns=None):
        columns = DEFAULT_REPORT_COLUMNS if columns is None else columns
        df = pd.concat([create_attendee_report(id, columns) for id in ids])
        filename = f"attendee_report_{'|'.join(str(id) for id in ids)}.csv"
        return to_csv_response(df, filename=filename)


DEFAULT_REPORT_COLUMNS = ['username', 'first_name', 'last_name', 'email', 'is_staff', 'year']

def to_csv_response(dataframe, filename):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename={filename}'
    dataframe.to_csv(path_or_buf=response)
    return response

def create_attendee_report(id_, columns):
    query_set = Event.objects.get(id=id_).signed_up_users.all().values()
    if query_set:
        return pd.DataFrame.from_records(query_set) \
                           .drop('password', errors='ignore', axis=1) \
                           .loc[:, columns]
    return pd.DataFrame()