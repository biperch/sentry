from __future__ import absolute_import

from sentry.db.deletion import BulkDeleteQuery
from sentry.models import GroupInbox
from sentry.tasks.base import instrumented_task


@instrumented_task(name="sentry.tasks.auto_remove_inbox", time_limit=30, soft_time_limit=20)
def auto_remove_inbox():
    BulkDeleteQuery(model=GroupInbox, days=7, dtfield="date_added").execute()
