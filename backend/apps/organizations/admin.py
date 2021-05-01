from django.contrib import admin
from apps.organizations.models import Organization, Membership

# Register your models here.
admin.site.register(Organization)
admin.site.register(Membership)
