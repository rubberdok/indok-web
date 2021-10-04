from datetime import datetime
from django.utils import timezone


class TimeResolvers:
    def resolve_server_time(self, _) -> datetime:
        return timezone.now()
