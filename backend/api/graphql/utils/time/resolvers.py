from datetime import datetime

class TimeResolvers:
  def resolve_server_time(self, info):
    return datetime.now()