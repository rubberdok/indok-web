from django.contrib import admin
from apps.events.models import Category, Event, SignUp

# Register your models here.
admin.site.register(Category)
admin.site.register(Event)
admin.site.register(SignUp)
