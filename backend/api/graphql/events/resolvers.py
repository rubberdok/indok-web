from apps.events.models import Category, Event


class EventResolvers:
    def resolve_all_events(parent, info):
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
