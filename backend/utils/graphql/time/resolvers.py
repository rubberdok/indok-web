from django.utils import timezone


class TimeResolvers:
    def resolve_server_time(self, _):
        return timezone.now()
