from django.contrib import admin
import apps.forms.models as models

# Register your models here.
admin.site.register(models.Answer)
admin.site.register(models.Option)
admin.site.register(models.Form)
admin.site.register(models.Question)
