from apps.events.models import Category, Event
from django.db.models import Q


class EventResolvers:
    def resolve_all_events(
        parent, info, category=None, organization=None, start_time=None, end_time=None
    ):
        string_names = ["category", "start_time", "end_time"]
        kwargs = {
            f"{string_names[i]}": element
            for i, element in enumerate([category, start_time, end_time])
            if element != None
        }
        if kwargs or organization:
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

            return Event.objects.filter(*queries)
        return Event.objects.all()

    def resolve_event(parent, info, id):
        try:
            return Event.objects.get(id=id)
        except Event.DoesNotExist:
            return None


class CategoryResolvers:
    def resolve_all_categories(parent, info):
        return Category.objects.all()

    def resolve_category(parent, info, id):
        try:
            return Category.objects.get(id=id)
        except Category.DoesNotExist:
            return None
