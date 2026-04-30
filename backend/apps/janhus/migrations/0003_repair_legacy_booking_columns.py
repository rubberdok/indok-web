from django.db import migrations, models


BOOKING_TABLE = "janhus_janhusbooking"
REQUEST_TABLE = "janhus_janhusbookingrequest"
SETTINGS_TABLE = "janhus_janhusbookingsettings"
LEGACY_AREA_TABLE = "janhus_janhusarea"
BOOKING_LEVEL_TABLE = "janhus_janhusbookinglevel"


def _table_columns(connection, table_name):
    with connection.cursor() as cursor:
        if table_name not in connection.introspection.table_names(cursor):
            return set()
        return {
            column.name
            for column in connection.introspection.get_table_description(cursor, table_name)
        }


def _rename_if_exists(schema_editor, table_name, old_name, new_name, columns):
    if old_name in columns and new_name not in columns:
        schema_editor.execute(
            f"ALTER TABLE {table_name} RENAME COLUMN {old_name} TO {new_name}"
        )
        columns.remove(old_name)
        columns.add(new_name)


def _add_column_if_missing(schema_editor, table_name, column_name, sql_type, default_sql, columns):
    if column_name in columns:
        return
    schema_editor.execute(
        f"ALTER TABLE {table_name} ADD COLUMN {column_name} {sql_type} NOT NULL DEFAULT {default_sql}"
    )
    columns.add(column_name)


def _add_nullable_column_if_missing(schema_editor, table_name, column_name, sql_type, columns):
    if column_name in columns:
        return
    schema_editor.execute(
        f"ALTER TABLE {table_name} ADD COLUMN {column_name} {sql_type} NULL"
    )
    columns.add(column_name)


def repair_legacy_booking_columns(apps, schema_editor):
    connection = schema_editor.connection

    booking_columns = _table_columns(connection, BOOKING_TABLE)
    if booking_columns:
        _rename_if_exists(schema_editor, BOOKING_TABLE, "start_time", "starts_at", booking_columns)
        _rename_if_exists(schema_editor, BOOKING_TABLE, "end_time", "ends_at", booking_columns)
        _rename_if_exists(schema_editor, BOOKING_TABLE, "created_by_id", "created_by_user_id", booking_columns)
        _rename_if_exists(schema_editor, BOOKING_TABLE, "cleaning_selected", "cleaning_requested", booking_columns)

        _add_column_if_missing(schema_editor, BOOKING_TABLE, "area", "varchar(32)", "'FIRST_FLOOR'", booking_columns)
        _add_column_if_missing(schema_editor, BOOKING_TABLE, "is_external_booking", "boolean", "false", booking_columns)
        _add_column_if_missing(schema_editor, BOOKING_TABLE, "booker_name", "varchar(200)", "''", booking_columns)
        _add_column_if_missing(schema_editor, BOOKING_TABLE, "booker_email", "varchar(254)", "''", booking_columns)
        _add_column_if_missing(schema_editor, BOOKING_TABLE, "booker_phone", "varchar(32)", "''", booking_columns)
        _add_column_if_missing(schema_editor, BOOKING_TABLE, "responsible_name", "varchar(200)", "''", booking_columns)
        _add_column_if_missing(schema_editor, BOOKING_TABLE, "responsible_email", "varchar(254)", "''", booking_columns)
        _add_column_if_missing(schema_editor, BOOKING_TABLE, "responsible_phone", "varchar(32)", "''", booking_columns)
        _add_column_if_missing(schema_editor, BOOKING_TABLE, "deposit_amount", "numeric(10,2)", "0", booking_columns)
        _add_column_if_missing(schema_editor, BOOKING_TABLE, "admin_comment", "text", "''", booking_columns)

        _add_nullable_column_if_missing(schema_editor, BOOKING_TABLE, "vipps_product_id", "bigint", booking_columns)
        _add_nullable_column_if_missing(schema_editor, BOOKING_TABLE, "vipps_order_id", "bigint", booking_columns)

        if "responsible_first_name" in booking_columns or "responsible_last_name" in booking_columns:
            schema_editor.execute(
                f"""
                UPDATE {BOOKING_TABLE}
                SET responsible_name = NULLIF(
                    TRIM(
                        COALESCE(responsible_first_name, '') || ' ' || COALESCE(responsible_last_name, '')
                    ),
                    ''
                )
                WHERE COALESCE(responsible_name, '') = ''
                """
            )

        if "decline_reason" in booking_columns:
            schema_editor.execute(
                f"""
                UPDATE {BOOKING_TABLE}
                SET admin_comment = decline_reason
                WHERE COALESCE(admin_comment, '') = '' AND COALESCE(decline_reason, '') <> ''
                """
            )

        if "pending_review_reason" in booking_columns:
            schema_editor.execute(
                f"""
                UPDATE {BOOKING_TABLE}
                SET admin_comment = pending_review_reason
                WHERE COALESCE(admin_comment, '') = '' AND COALESCE(pending_review_reason, '') <> ''
                """
            )

        if "area_id" in booking_columns and LEGACY_AREA_TABLE in _table_columns(connection, LEGACY_AREA_TABLE):
            schema_editor.execute(
                f"""
                UPDATE {BOOKING_TABLE} booking
                SET area = CASE legacy.slug
                    WHEN 'first-floor' THEN 'FIRST_FLOOR'
                    WHEN 'second-floor' THEN 'SECOND_FLOOR'
                    WHEN 'entire-house' THEN 'ENTIRE_HOUSE'
                    ELSE booking.area
                END
                FROM {LEGACY_AREA_TABLE} legacy
                WHERE booking.area_id = legacy.id
                """
            )

    request_columns = _table_columns(connection, REQUEST_TABLE)
    if request_columns:
        _rename_if_exists(schema_editor, REQUEST_TABLE, "requested_start_time", "starts_at", request_columns)
        _rename_if_exists(schema_editor, REQUEST_TABLE, "requested_end_time", "ends_at", request_columns)
        _rename_if_exists(schema_editor, REQUEST_TABLE, "organization_id", "owner_organization_id", request_columns)
        _rename_if_exists(schema_editor, REQUEST_TABLE, "review_comment", "admin_comment", request_columns)
        _rename_if_exists(schema_editor, REQUEST_TABLE, "cleaning_selected", "cleaning_requested", request_columns)

        _add_column_if_missing(schema_editor, REQUEST_TABLE, "area", "varchar(32)", "'FIRST_FLOOR'", request_columns)
        _add_column_if_missing(schema_editor, REQUEST_TABLE, "responsible_name", "varchar(200)", "''", request_columns)
        _add_column_if_missing(schema_editor, REQUEST_TABLE, "responsible_email", "varchar(254)", "''", request_columns)
        _add_column_if_missing(schema_editor, REQUEST_TABLE, "responsible_phone", "varchar(32)", "''", request_columns)
        _add_column_if_missing(schema_editor, REQUEST_TABLE, "admin_comment", "text", "''", request_columns)

        _add_nullable_column_if_missing(schema_editor, REQUEST_TABLE, "converted_booking_id", "bigint", request_columns)
        _add_nullable_column_if_missing(schema_editor, REQUEST_TABLE, "requester_user_id", "integer", request_columns)

        if "created_by_id" in request_columns and "requester_user_id" in request_columns:
            schema_editor.execute(
                f"""
                UPDATE {REQUEST_TABLE}
                SET requester_user_id = created_by_id
                WHERE requester_user_id IS NULL
                """
            )

        if "responsible_first_name" in request_columns or "responsible_last_name" in request_columns:
            schema_editor.execute(
                f"""
                UPDATE {REQUEST_TABLE}
                SET responsible_name = NULLIF(
                    TRIM(
                        COALESCE(responsible_first_name, '') || ' ' || COALESCE(responsible_last_name, '')
                    ),
                    ''
                )
                WHERE COALESCE(responsible_name, '') = ''
                """
            )

        if "area_id" in request_columns and LEGACY_AREA_TABLE in _table_columns(connection, LEGACY_AREA_TABLE):
            schema_editor.execute(
                f"""
                UPDATE {REQUEST_TABLE} request
                SET area = CASE legacy.slug
                    WHEN 'first-floor' THEN 'FIRST_FLOOR'
                    WHEN 'second-floor' THEN 'SECOND_FLOOR'
                    WHEN 'entire-house' THEN 'ENTIRE_HOUSE'
                    ELSE request.area
                END
                FROM {LEGACY_AREA_TABLE} legacy
                WHERE request.area_id = legacy.id
                """
            )

    settings_columns = _table_columns(connection, SETTINGS_TABLE)
    if settings_columns and "external_bookings_enabled" not in settings_columns:
        schema_editor.execute(
            f"ALTER TABLE {SETTINGS_TABLE} ADD COLUMN external_bookings_enabled boolean NOT NULL DEFAULT true"
        )

    booking_level_columns = _table_columns(connection, BOOKING_LEVEL_TABLE)
    if booking_level_columns:
        _add_column_if_missing(schema_editor, BOOKING_LEVEL_TABLE, "description", "text", "''", booking_level_columns)
        _add_column_if_missing(schema_editor, BOOKING_LEVEL_TABLE, "can_book_anytime", "boolean", "false", booking_level_columns)
        _add_column_if_missing(
            schema_editor,
            BOOKING_LEVEL_TABLE,
            "can_create_provisional",
            "boolean",
            "false",
            booking_level_columns,
        )
        _add_column_if_missing(
            schema_editor,
            BOOKING_LEVEL_TABLE,
            "can_create_confirmed",
            "boolean",
            "true",
            booking_level_columns,
        )
        _add_column_if_missing(
            schema_editor,
            BOOKING_LEVEL_TABLE,
            "can_override_lower_levels",
            "boolean",
            "false",
            booking_level_columns,
        )
        _add_column_if_missing(
            schema_editor,
            BOOKING_LEVEL_TABLE,
            "can_edit_own_bookings_only",
            "boolean",
            "true",
            booking_level_columns,
        )
        _add_column_if_missing(
            schema_editor,
            BOOKING_LEVEL_TABLE,
            "can_edit_all_bookings",
            "boolean",
            "false",
            booking_level_columns,
        )
        _add_nullable_column_if_missing(
            schema_editor,
            BOOKING_LEVEL_TABLE,
            "booking_opens_weeks_before",
            "integer",
            booking_level_columns,
        )

    schema_editor.execute(
        """
        DO $$
        DECLARE
            legacy_col RECORD;
        BEGIN
            IF EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_name = 'janhus_janhusbookingrequest'
                AND column_name = 'responsible_first_name'
            ) THEN
                EXECUTE 'UPDATE janhus_janhusbookingrequest SET responsible_first_name = '''' WHERE responsible_first_name IS NULL';
                EXECUTE 'ALTER TABLE janhus_janhusbookingrequest ALTER COLUMN responsible_first_name SET DEFAULT ''''';
                EXECUTE 'ALTER TABLE janhus_janhusbookingrequest ALTER COLUMN responsible_first_name DROP NOT NULL';
            END IF;

            IF EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_name = 'janhus_janhusbookingrequest'
                AND column_name = 'responsible_last_name'
            ) THEN
                EXECUTE 'UPDATE janhus_janhusbookingrequest SET responsible_last_name = '''' WHERE responsible_last_name IS NULL';
                EXECUTE 'ALTER TABLE janhus_janhusbookingrequest ALTER COLUMN responsible_last_name SET DEFAULT ''''';
                EXECUTE 'ALTER TABLE janhus_janhusbookingrequest ALTER COLUMN responsible_last_name DROP NOT NULL';
            END IF;

            IF EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_name = 'janhus_janhusbooking'
                AND column_name = 'responsible_first_name'
            ) THEN
                EXECUTE 'UPDATE janhus_janhusbooking SET responsible_first_name = '''' WHERE responsible_first_name IS NULL';
                EXECUTE 'ALTER TABLE janhus_janhusbooking ALTER COLUMN responsible_first_name SET DEFAULT ''''';
                EXECUTE 'ALTER TABLE janhus_janhusbooking ALTER COLUMN responsible_first_name DROP NOT NULL';
            END IF;

            IF EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_name = 'janhus_janhusbooking'
                AND column_name = 'responsible_last_name'
            ) THEN
                EXECUTE 'UPDATE janhus_janhusbooking SET responsible_last_name = '''' WHERE responsible_last_name IS NULL';
                EXECUTE 'ALTER TABLE janhus_janhusbooking ALTER COLUMN responsible_last_name SET DEFAULT ''''';
                EXECUTE 'ALTER TABLE janhus_janhusbooking ALTER COLUMN responsible_last_name DROP NOT NULL';
            END IF;

            IF EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_name = 'janhus_janhusbookingrequest'
                AND column_name = 'bankid_status'
            ) THEN
                EXECUTE 'UPDATE janhus_janhusbookingrequest SET bankid_status = ''NOT_STARTED'' WHERE bankid_status IS NULL';
                EXECUTE 'ALTER TABLE janhus_janhusbookingrequest ALTER COLUMN bankid_status SET DEFAULT ''NOT_STARTED''';
                EXECUTE 'ALTER TABLE janhus_janhusbookingrequest ALTER COLUMN bankid_status DROP NOT NULL';
            END IF;

            IF EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_name = 'janhus_janhusbookingrequest'
                AND column_name = 'bankid_reference'
            ) THEN
                EXECUTE 'UPDATE janhus_janhusbookingrequest SET bankid_reference = '''' WHERE bankid_reference IS NULL';
                EXECUTE 'ALTER TABLE janhus_janhusbookingrequest ALTER COLUMN bankid_reference SET DEFAULT ''''';
                EXECUTE 'ALTER TABLE janhus_janhusbookingrequest ALTER COLUMN bankid_reference DROP NOT NULL';
            END IF;

            IF EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_name = 'janhus_janhusbookingrequest'
                AND column_name = 'area_id'
            ) THEN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_name = 'janhus_janhusbookingrequest' AND column_name = 'area'
                ) AND EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_name = 'janhus_janhusarea' AND column_name = 'slug'
                ) THEN
                    EXECUTE '
                        UPDATE janhus_janhusbookingrequest request
                        SET area_id = legacy.id
                        FROM janhus_janhusarea legacy
                        WHERE request.area_id IS NULL
                          AND (
                            (request.area = ''FIRST_FLOOR'' AND legacy.slug = ''first-floor'')
                            OR (request.area = ''SECOND_FLOOR'' AND legacy.slug = ''second-floor'')
                            OR (request.area = ''ENTIRE_HOUSE'' AND legacy.slug = ''entire-house'')
                          )
                    ';
                END IF;

                EXECUTE 'ALTER TABLE janhus_janhusbookingrequest ALTER COLUMN area_id DROP NOT NULL';
            END IF;

            IF EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_name = 'janhus_janhusbooking'
                AND column_name = 'area_id'
            ) THEN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_name = 'janhus_janhusbooking' AND column_name = 'area'
                ) AND EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_name = 'janhus_janhusarea' AND column_name = 'slug'
                ) THEN
                    EXECUTE '
                        UPDATE janhus_janhusbooking booking
                        SET area_id = legacy.id
                        FROM janhus_janhusarea legacy
                        WHERE booking.area_id IS NULL
                          AND (
                            (booking.area = ''FIRST_FLOOR'' AND legacy.slug = ''first-floor'')
                            OR (booking.area = ''SECOND_FLOOR'' AND legacy.slug = ''second-floor'')
                            OR (booking.area = ''ENTIRE_HOUSE'' AND legacy.slug = ''entire-house'')
                          )
                    ';
                END IF;

                EXECUTE 'ALTER TABLE janhus_janhusbooking ALTER COLUMN area_id DROP NOT NULL';
            END IF;

            FOR legacy_col IN
                SELECT column_name, data_type
                FROM information_schema.columns
                WHERE table_name = 'janhus_janhusbookinglevel'
                  AND column_name NOT IN (
                    'id',
                    'name',
                    'description',
                    'priority',
                    'can_book_anytime',
                    'can_create_provisional',
                    'can_create_confirmed',
                    'can_override_lower_levels',
                    'can_edit_own_bookings_only',
                    'can_edit_all_bookings',
                    'booking_opens_weeks_before'
                  )
                  AND is_nullable = 'NO'
            LOOP
                EXECUTE format('ALTER TABLE janhus_janhusbookinglevel ALTER COLUMN %%I DROP NOT NULL', legacy_col.column_name);
                IF legacy_col.data_type IN ('character varying', 'text') THEN
                    EXECUTE format(
                        'ALTER TABLE janhus_janhusbookinglevel ALTER COLUMN %%I SET DEFAULT %%L',
                        legacy_col.column_name,
                        ''
                    );
                ELSIF legacy_col.data_type = 'boolean' THEN
                    EXECUTE format('ALTER TABLE janhus_janhusbookinglevel ALTER COLUMN %%I SET DEFAULT false', legacy_col.column_name);
                END IF;
            END LOOP;

            FOR legacy_col IN
                SELECT column_name, data_type
                FROM information_schema.columns
                WHERE table_name = 'janhus_janhusbookingrequest'
                  AND column_name NOT IN (
                    'id',
                    'starts_at',
                    'ends_at',
                    'area',
                    'requester_user_id',
                    'owner_organization_id',
                    'requester_name',
                    'requester_email',
                    'requester_phone',
                    'responsible_name',
                    'responsible_email',
                    'responsible_phone',
                    'event_type',
                    'cleaning_requested',
                    'comment',
                    'status',
                    'admin_comment',
                    'converted_booking_id',
                    'created_at',
                    'updated_at'
                  )
                  AND is_nullable = 'NO'
            LOOP
                EXECUTE format('ALTER TABLE janhus_janhusbookingrequest ALTER COLUMN %%I DROP NOT NULL', legacy_col.column_name);
                IF legacy_col.data_type IN ('character varying', 'text') THEN
                    EXECUTE format(
                        'ALTER TABLE janhus_janhusbookingrequest ALTER COLUMN %%I SET DEFAULT %%L',
                        legacy_col.column_name,
                        ''
                    );
                ELSIF legacy_col.data_type = 'boolean' THEN
                    EXECUTE format('ALTER TABLE janhus_janhusbookingrequest ALTER COLUMN %%I SET DEFAULT false', legacy_col.column_name);
                END IF;
            END LOOP;

            FOR legacy_col IN
                SELECT column_name, data_type
                FROM information_schema.columns
                WHERE table_name = 'janhus_janhusbooking'
                  AND column_name NOT IN (
                    'id',
                    'starts_at',
                    'ends_at',
                    'area',
                    'status',
                    'owner_user_id',
                    'owner_organization_id',
                    'booking_level_id',
                    'created_by_user_id',
                    'is_external_booking',
                    'booker_name',
                    'booker_email',
                    'booker_phone',
                    'responsible_name',
                    'responsible_email',
                    'responsible_phone',
                    'event_type',
                    'cleaning_requested',
                    'deposit_status',
                    'deposit_amount',
                    'comment',
                    'admin_comment',
                    'bankid_status',
                    'bankid_reference',
                    'vipps_product_id',
                    'vipps_order_id',
                    'created_at',
                    'updated_at'
                  )
                  AND is_nullable = 'NO'
            LOOP
                EXECUTE format('ALTER TABLE janhus_janhusbooking ALTER COLUMN %%I DROP NOT NULL', legacy_col.column_name);
                IF legacy_col.data_type IN ('character varying', 'text') THEN
                    EXECUTE format(
                        'ALTER TABLE janhus_janhusbooking ALTER COLUMN %%I SET DEFAULT %%L',
                        legacy_col.column_name,
                        ''
                    );
                ELSIF legacy_col.data_type = 'boolean' THEN
                    EXECUTE format('ALTER TABLE janhus_janhusbooking ALTER COLUMN %%I SET DEFAULT false', legacy_col.column_name);
                END IF;
            END LOOP;
        END
        $$;
        """
    )


class Migration(migrations.Migration):

    dependencies = [
        ("janhus", "0002_repair_schema_drift"),
    ]

    operations = [
        migrations.RunPython(repair_legacy_booking_columns, migrations.RunPython.noop),
        migrations.SeparateDatabaseAndState(
            database_operations=[],
            state_operations=[
                migrations.AddField(
                    model_name="janhusbookingsettings",
                    name="external_bookings_enabled",
                    field=models.BooleanField(default=True),
                ),
            ],
        ),
    ]
