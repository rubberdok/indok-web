from django.utils import timezone

class TimeResolvers:
  def resolve_server_time(self, info):
    return timezone.now()
