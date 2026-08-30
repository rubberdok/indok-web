"""
Repair the payment columns on databases that went through the legacy drift
path.

`0003_repair_legacy_booking_columns` re-adds `vipps_order_id` as `bigint`, but
`ecommerce.Order` has a UUID primary key, so on any database where that repair
actually fired the column has the wrong type and confirming a paid booking dies
with "column vipps_order_id is of type bigint but expression is of type uuid".
That repair also adds both payment columns as bare columns, without the foreign
keys the model declares.

Every step below is guarded, so a database built cleanly from 0001 (the test
database, and any environment that never drifted) is left untouched.
"""
from django.db import migrations

BOOKING_TABLE = "janhus_janhusbooking"


def _column_type(schema_editor, column):
    with schema_editor.connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT data_type
            FROM information_schema.columns
            WHERE table_name = %s AND column_name = %s
            """,
            [BOOKING_TABLE, column],
        )
        row = cursor.fetchone()
    return row[0] if row else None


def _has_foreign_key(schema_editor, column):
    with schema_editor.connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT 1
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu
              ON tc.constraint_name = kcu.constraint_name
            WHERE tc.table_name = %s
              AND tc.constraint_type = 'FOREIGN KEY'
              AND kcu.column_name = %s
            LIMIT 1
            """,
            [BOOKING_TABLE, column],
        )
        return cursor.fetchone() is not None


def repair_payment_columns(apps, schema_editor):
    order_column_type = _column_type(schema_editor, "vipps_order_id")

    if order_column_type is not None and order_column_type != "uuid":
        schema_editor.execute(
            f'UPDATE {BOOKING_TABLE} SET vipps_order_id = NULL '
            f"WHERE vipps_order_id IS NOT NULL"
        )
        schema_editor.execute(
            f'ALTER TABLE {BOOKING_TABLE} '
            f"ALTER COLUMN vipps_order_id TYPE uuid USING NULL"
        )

    if _column_type(schema_editor, "vipps_order_id") == "uuid" and not _has_foreign_key(
        schema_editor, "vipps_order_id"
    ):
        schema_editor.execute(
            f"ALTER TABLE {BOOKING_TABLE} "
            f"ADD CONSTRAINT janhus_booking_vipps_order_fk "
            f"FOREIGN KEY (vipps_order_id) REFERENCES ecommerce_order (id) "
            f"ON DELETE SET NULL DEFERRABLE INITIALLY DEFERRED"
        )

    if _column_type(schema_editor, "vipps_product_id") is not None and not (
        _has_foreign_key(schema_editor, "vipps_product_id")
    ):
        schema_editor.execute(
            f'UPDATE {BOOKING_TABLE} SET vipps_product_id = NULL '
            f"WHERE vipps_product_id IS NOT NULL "
            f"AND vipps_product_id NOT IN (SELECT id FROM ecommerce_product)"
        )
        schema_editor.execute(
            f"ALTER TABLE {BOOKING_TABLE} "
            f"ADD CONSTRAINT janhus_booking_vipps_product_fk "
            f"FOREIGN KEY (vipps_product_id) REFERENCES ecommerce_product (id) "
            f"ON DELETE SET NULL DEFERRABLE INITIALLY DEFERRED"
        )


class Migration(migrations.Migration):

    dependencies = [
        ("janhus", "0018_janhusbookingrequest_reference"),
        ("ecommerce", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(repair_payment_columns, migrations.RunPython.noop),
    ]
