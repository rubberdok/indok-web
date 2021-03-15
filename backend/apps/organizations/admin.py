from django.contrib import admin
from apps.organizations.models import Organization, Membership, Role

# Register your models here.
admin.site.register(Organization)
admin.site.register(Membership)
admin.site.register(Role)
