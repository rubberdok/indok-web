import cors from "cors";
import express from "express";
import http from "http";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";

import * as Sentry from "@sentry/node";

import { json } from "body-parser";
import { env } from "./config";

import { container } from "./container";
import { resolvers, typeDefs } from "./graphql";
import {
  IContextProvider,
  Type as ContextProviderType,
} from "./graphql/context";

Sentry.init({
  dsn: env.SENTRY_DSN,
  tracesSampleRate: env.SENTRY_TRACES_SAMPLE_RATE,
});

const start = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  app.use(Sentry.Handlers.requestHandler());

  const server = new ApolloServer<IContextProvider>({
    csrfPrevention: true,
    introspection: true,
    resolvers,
    typeDefs,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault,
    ],
  });

  await server.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context: async () => container.get<IContextProvider>(ContextProviderType),
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: env.PORT }, resolve)
  );

  console.info(
    `[INFO] ${new Date()} 🚀 Server ready at ${app.path()}/graphql}`
  );
  console.info("[INFO] CTRL+C to exit");
};

start();
