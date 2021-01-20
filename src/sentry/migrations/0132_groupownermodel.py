# -*- coding: utf-8 -*-
# Generated by Django 1.11.29 on 2020-11-20 18:43
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import sentry.db.models.fields.bounded
import sentry.db.models.fields.foreignkey
import sentry.models.groupowner


class Migration(migrations.Migration):
    # This flag is used to mark that a migration shouldn't be automatically run in
    # production. We set this to True for operations that we think are risky and want
    # someone from ops to run manually and monitor.
    # General advice is that if in doubt, mark your migration as `is_dangerous`.
    # Some things you should always mark as dangerous:
    # - Large data migrations. Typically we want these to be run manually by ops so that
    #   they can be monitored. Since data migrations will now hold a transaction open
    #   this is even more important.
    # - Adding columns to highly active tables, even ones that are NULL.
    is_dangerous = False

    # This flag is used to decide whether to run this migration in a transaction or not.
    # By default we prefer to run in a transaction, but for migrations where you want
    # to `CREATE INDEX CONCURRENTLY` this needs to be set to False. Typically you'll
    # want to create an index concurrently when adding one to an existing table.
    atomic = True

    dependencies = [
        ("sentry", "0131_drop_widget_tables"),
    ]

    operations = [
        migrations.CreateModel(
            name="GroupOwner",
            fields=[
                (
                    "id",
                    sentry.db.models.fields.bounded.BoundedBigAutoField(
                        primary_key=True, serialize=False
                    ),
                ),
                (
                    "type",
                    models.PositiveSmallIntegerField(
                        choices=[
                            (sentry.models.groupowner.GroupOwnerType(0), "Suspect Commit"),
                            (sentry.models.groupowner.GroupOwnerType(1), "Ownership Rule"),
                        ]
                    ),
                ),
                ("date_added", models.DateTimeField(default=django.utils.timezone.now)),
                (
                    "group",
                    sentry.db.models.fields.foreignkey.FlexibleForeignKey(
                        db_constraint=False,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="sentry.Group",
                        unique=True,
                    ),
                ),
                (
                    "organization",
                    sentry.db.models.fields.foreignkey.FlexibleForeignKey(
                        db_constraint=False,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="sentry.Organization",
                    ),
                ),
                (
                    "project",
                    sentry.db.models.fields.foreignkey.FlexibleForeignKey(
                        db_constraint=False,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="sentry.Project",
                    ),
                ),
                (
                    "team",
                    sentry.db.models.fields.foreignkey.FlexibleForeignKey(
                        null=True, on_delete=django.db.models.deletion.CASCADE, to="sentry.Team"
                    ),
                ),
                (
                    "user",
                    sentry.db.models.fields.foreignkey.FlexibleForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "db_table": "sentry_groupowner",
            },
        ),
    ]
