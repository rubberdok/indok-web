import * as Sentry from "@sentry/node";
import { ApolloError, PluginDefinition } from "apollo-server-core";

export const SentryErrorPlugin: PluginDefinition = () => {
  return {
    async requestDidStart(_) {
      return {
        async didEncounterErrors(ctx) {
          if (typeof ctx.operation === "undefined") {
            return;
          }

          for (const err of ctx.errors) {
            if (err instanceof ApolloError) {
              continue;
            }

            Sentry.withScope((scope) => {
              // Annotate whether failing operation was query/mutation/subscription
              scope.setTag("kind", ctx.operation?.operation);
              // Log query and variables as extras
              // (make sure to strip out sensitive data!)
              scope.setExtra("query", ctx.request.query);
              scope.setExtra("variables", ctx.request.variables);
              if (err.path) {
                // We can also add the path as breadcrumb
                scope.addBreadcrumb({
                  category: "query-path",
                  message: err.path.join(" > "),
                  level: "debug",
                });
              }
              Sentry.captureException(err);
            });
          }
        },
      };
    },
  };
};
