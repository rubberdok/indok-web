from django.db import models
from django.contrib.auth.models import Group
import uuid

def hex_uuid_group():
  return Group.objects.create(name=uuid.uuid4().hex)

class ResponsibleGroup(models.Model):
  """
  Recommended workaround to extend the Group model.
  See https://groups.google.com/g/django-developers/c/llQJZUKejXg/discussion
  """
  uuid = models.UUIDField(primary_key=True, default=uuid.uuid4)
  group = models.OneToOneField(to=Group, on_delete=models.CASCADE, default=hex_uuid_group)
  name = models.CharField(max_length=250)