from apps.events.models import Category, Event


class EventResolvers:
    def resolve_all_events(parent, info):
        return Event.objects.all()

    def resolve_event(info, id):
        try:
            return Event.objects.get(id=id)
        except Event.DoesNotExist:
            return None

    def resolve_all_categories(info):
        return Category.objects.all()

    def resolve_category(info, id):
        try:
            return Category.objects.get(id=id)
        except Category.DoesNotExist:
            return None
