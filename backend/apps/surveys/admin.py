from django.contrib import admin
import apps.surveys.models as models
# Register your models here.
admin.site.register(models.QuestionType)
admin.site.register(models.Answer)
admin.site.register(models.OfferedAnswer)
admin.site.register(models.Survey)
admin.site.register(models.SurveyQuestion)
