# Generated by Django 3.1.2 on 2021-03-13 11:25

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("archive", "0013_auto_20210225_1752"),
    ]

    operations = [
        migrations.AddField(
            model_name="archivedocument",
            name="featured",
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name="archivedocument",
            name="year",
            field=models.PositiveSmallIntegerField(blank=True, null=True),
        ),
    ]
