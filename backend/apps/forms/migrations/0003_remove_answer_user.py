# Generated by Django 3.1.6 on 2021-04-16 11:06

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("forms", "0002_auto_20210408_1735"),
    ]

    operations = [
        migrations.RemoveConstraint(
            model_name="answer",
            name="unique_answer_to_question_per_user",
        ),
        migrations.RemoveField(
            model_name="answer",
            name="user",
        ),
    ]
