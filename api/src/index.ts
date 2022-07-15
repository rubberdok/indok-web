import * as Sentry from "@sentry/node";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import http from "http";
import { env } from "./config";
import context, { initializeDB } from "./context";
import { resolvers, typeDefs } from "./graphql";

Sentry.init({
  dsn: env.SENTRY_DSN,
  tracesSampleRate: env.SENTRY_TRACES_SAMPLE_RATE,
});

const startApolloServer = async () => {
  const app = express();
  const httpServer = http.createServer(app);
  const db = initializeDB();

  app.use(Sentry.Handlers.requestHandler());

  const server = new ApolloServer({
    csrfPrevention: true,
    cache: "bounded",
    context: context(db),
    introspection: true,
    resolvers,
    typeDefs,
    plugins: [
      env.NODE_ENV === "production"
        ? ApolloServerPluginLandingPageDisabled()
        : ApolloServerPluginLandingPageLocalDefault(),
      ApolloServerPluginDrainHttpServer({ httpServer }),
    ],
  });
  await server.start();
  server.applyMiddleware({
    app,
    path: "/",
  });

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: env.PORT }, resolve)
  );
  console.info(`[INFO] ${new Date()} 🚀 Server ready at ${server.graphqlPath}`);
  console.info("[INFO] CTRL+C to exit");
};

startApolloServer();
