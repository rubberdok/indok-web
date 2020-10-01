from apps.events.models import Event


class EventResolvers:
    def resolve_all_events(parent, info):
        return Event.objects.all()

    def resolve_event(parent, info, id):
        try:
            return Event.objects.get(id=id)
        except Event.DoesNotExist:
            return None
