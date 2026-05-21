from decimal import Decimal

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("janhus", "0003_repair_legacy_booking_columns"),
    ]

    operations = [
        migrations.AddField(
            model_name="janhusareaconfiguration",
            name="default_deposit_amount",
            field=models.DecimalField(
                decimal_places=2, default=Decimal("0"), max_digits=10
            ),
        ),
    ]
