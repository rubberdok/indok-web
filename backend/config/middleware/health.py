from typing import Any, Callable

from django.db import DEFAULT_DB_ALIAS, connections
from django.db.migrations.executor import MigrationExecutor
from django.http import HttpRequest, HttpResponse


class HealthcheckMiddleware:
    def __init__(self, get_response: Callable[[HttpRequest], Any]) -> None:
        self.get_response = get_response

    def __call__(self, request: HttpRequest):
        """
        Service is healthy if DB is migrated to the current state,
        otherwise it is not. This is used in combination with AWS ELB health
        checks in order to run DB migrations only when necessary.

        Returns
        -------
        HttpResponse
            200 if all good, 503 if there are migrations pending.
        """
        if request.path.strip("/") == "health":
            executor = MigrationExecutor(connections[DEFAULT_DB_ALIAS])
            plan = executor.migration_plan(executor.loader.graph.leaf_nodes())
            status = 503 if plan else 200
            return HttpResponse(status=status)
        return self.get_response(request)
