from apps.events.models import Category, Event


class EventResolvers:
    def resolve_all_events(parent, info):
        return Event.objects.all()

<<<<<<< HEAD
    def resolve_event(info, id):
=======
    def resolve_event(parent, info, id):
>>>>>>> 94a756da0bddd3b620e0c64e685e4595b646076d
        try:
            return Event.objects.get(id=id)
        except Event.DoesNotExist:
            return None

<<<<<<< HEAD
    def resolve_all_categories(info):
        return Category.objects.all()

    def resolve_category(info, id):
=======

class CategoryResolvers:
    def resolve_all_categories(parent, info):
        return Category.objects.all()

    def resolve_category(parent, info, id):
>>>>>>> 94a756da0bddd3b620e0c64e685e4595b646076d
        try:
            return Category.objects.get(id=id)
        except Category.DoesNotExist:
            return None
