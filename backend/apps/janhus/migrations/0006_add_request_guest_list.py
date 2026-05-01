from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("janhus", "0005_auto_20260501_0012"),
    ]

    operations = [
        migrations.AddField(
            model_name="janhusbookingrequest",
            name="guest_list",
            field=models.TextField(blank=True, default=""),
        ),
    ]
