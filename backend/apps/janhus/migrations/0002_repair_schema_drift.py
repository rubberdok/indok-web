from django.db import migrations


SETTINGS_TABLE = "janhus_janhusbookingsettings"
LEGACY_AREA_TABLE = "janhus_janhusarea"
LEGACY_ASSIGNMENT_TABLE = "janhus_janhusbookinglevelassignment"


def _repair_settings_columns(schema_editor, existing_columns):
    column_sql = {
        "min_duration_minutes": (
            f"ALTER TABLE {SETTINGS_TABLE} "
            "ADD COLUMN min_duration_minutes integer NOT NULL DEFAULT 60"
        ),
        "slot_granularity_minutes": (
            f"ALTER TABLE {SETTINGS_TABLE} "
            "ADD COLUMN slot_granularity_minutes integer NOT NULL DEFAULT 30"
        ),
        "opening_hour": (
            f"ALTER TABLE {SETTINGS_TABLE} "
            "ADD COLUMN opening_hour integer NOT NULL DEFAULT 8"
        ),
        "closing_hour": (
            f"ALTER TABLE {SETTINGS_TABLE} "
            "ADD COLUMN closing_hour integer NOT NULL DEFAULT 2"
        ),
        "organization_booking_opens_weeks_before": (
            f"ALTER TABLE {SETTINGS_TABLE} "
            "ADD COLUMN organization_booking_opens_weeks_before integer NOT NULL DEFAULT 6"
        ),
        "general_booking_opens_weeks_before": (
            f"ALTER TABLE {SETTINGS_TABLE} "
            "ADD COLUMN general_booking_opens_weeks_before integer NOT NULL DEFAULT 4"
        ),
        "bankid_provider": (
            f"ALTER TABLE {SETTINGS_TABLE} "
            "ADD COLUMN bankid_provider varchar(100) NOT NULL DEFAULT 'IDURA_STUB'"
        ),
    }

    for column_name, sql in column_sql.items():
        if column_name in existing_columns:
            continue
        schema_editor.execute(sql)


def repair_janhus_schema_drift(apps, schema_editor):
    connection = schema_editor.connection

    with connection.cursor() as cursor:
        existing_tables = set(connection.introspection.table_names(cursor))

    def create_table_if_missing(model_name):
        model = apps.get_model("janhus", model_name)
        table_name = model._meta.db_table
        if table_name in existing_tables:
            return
        schema_editor.create_model(model)
        existing_tables.add(table_name)

    # Create missing tables from current schema.
    create_table_if_missing("JanHusAreaConfiguration")
    create_table_if_missing("JanHusUserBookingLevel")
    create_table_if_missing("JanHusOrganizationBookingLevel")

    # Ensure new settings columns exist in drifted DBs.
    if SETTINGS_TABLE in existing_tables:
        with connection.cursor() as cursor:
            existing_columns = {
                column.name
                for column in connection.introspection.get_table_description(
                    cursor, SETTINGS_TABLE
                )
            }
        _repair_settings_columns(schema_editor, existing_columns)

    # Optional data migration from legacy assignment table.
    if LEGACY_ASSIGNMENT_TABLE in existing_tables:
        user_level_table = apps.get_model(
            "janhus", "JanHusUserBookingLevel"
        )._meta.db_table
        org_level_table = apps.get_model(
            "janhus", "JanHusOrganizationBookingLevel"
        )._meta.db_table

        schema_editor.execute(
            f"""
            INSERT INTO {user_level_table} (level_id, user_id)
            SELECT legacy.level_id, legacy.user_id
            FROM {LEGACY_ASSIGNMENT_TABLE} legacy
            WHERE legacy.user_id IS NOT NULL
            AND NOT EXISTS (
                SELECT 1 FROM {user_level_table} current
                WHERE current.user_id = legacy.user_id
            )
            """
        )

        schema_editor.execute(
            f"""
            INSERT INTO {org_level_table} (level_id, organization_id)
            SELECT legacy.level_id, legacy.organization_id
            FROM {LEGACY_ASSIGNMENT_TABLE} legacy
            WHERE legacy.organization_id IS NOT NULL
            AND NOT EXISTS (
                SELECT 1 FROM {org_level_table} current
                WHERE current.organization_id = legacy.organization_id
            )
            """
        )

    # Optional data migration from legacy area table if the new table is empty.
    if LEGACY_AREA_TABLE in existing_tables:
        area_table = apps.get_model("janhus", "JanHusAreaConfiguration")._meta.db_table
        schema_editor.execute(
            f"""
            INSERT INTO {area_table} (area, internal_price_per_hour, external_price_per_hour, cleaning_fee)
            SELECT
                CASE legacy.slug
                    WHEN 'first-floor' THEN 'FIRST_FLOOR'
                    WHEN 'second-floor' THEN 'SECOND_FLOOR'
                    WHEN 'entire-house' THEN 'ENTIRE_HOUSE'
                    ELSE NULL
                END,
                COALESCE(legacy.internal_price_per_hour, 0),
                COALESCE(legacy.external_price_per_hour, 0),
                COALESCE(legacy.cleaning_fee_internal, 0)
            FROM {LEGACY_AREA_TABLE} legacy
            WHERE legacy.slug IN ('first-floor', 'second-floor', 'entire-house')
            AND NOT EXISTS (
                SELECT 1 FROM {area_table} current
                WHERE current.area = CASE legacy.slug
                    WHEN 'first-floor' THEN 'FIRST_FLOOR'
                    WHEN 'second-floor' THEN 'SECOND_FLOOR'
                    WHEN 'entire-house' THEN 'ENTIRE_HOUSE'
                    ELSE NULL
                END
            )
            """
        )


class Migration(migrations.Migration):

    dependencies = [
        ("janhus", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(repair_janhus_schema_drift, migrations.RunPython.noop),
    ]
