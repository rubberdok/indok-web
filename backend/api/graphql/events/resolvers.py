from apps.events.models import Event
from apps.users.decorators import login_required


class EventResolvers:
    @login_required
    def resolve_all_events(parent, info):
        return Event.objects.all()

    @login_required
    def resolve_event(parent, info, id):
        try:
            return Event.objects.get(id=id)
        except Event.DoesNotExist:
            return None
