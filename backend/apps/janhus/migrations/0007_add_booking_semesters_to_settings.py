from datetime import date

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("janhus", "0006_add_request_guest_list"),
    ]

    operations = [
        migrations.AddField(
            model_name="janhusbookingsettings",
            name="fall_end_date",
            field=models.DateField(default=date(2100, 12, 31)),
        ),
        migrations.AddField(
            model_name="janhusbookingsettings",
            name="fall_semester_active",
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name="janhusbookingsettings",
            name="fall_start_date",
            field=models.DateField(default=date(1970, 1, 1)),
        ),
        migrations.AddField(
            model_name="janhusbookingsettings",
            name="spring_end_date",
            field=models.DateField(default=date(2100, 12, 31)),
        ),
        migrations.AddField(
            model_name="janhusbookingsettings",
            name="spring_semester_active",
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name="janhusbookingsettings",
            name="spring_start_date",
            field=models.DateField(default=date(1970, 1, 1)),
        ),
    ]
