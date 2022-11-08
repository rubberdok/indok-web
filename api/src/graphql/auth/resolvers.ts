import { ApolloServerErrorCode } from "@apollo/server/errors";
import { GraphQLError } from "graphql";

import { Resolvers, LogoutStatus } from "../generated/types";

export const resolvers: Resolvers = {
  Mutation: {
    redirectUrl(_root, { state }, ctx) {
      const { url, codeVerifier } = ctx.authService.ssoUrl(state);
      ctx.req.session.codeVerifier = codeVerifier;
      return { url };
    },

    logout(_root, _args, ctx) {
      ctx.req.session.userId = null;
      ctx.req.session.save(() => {
        ctx.req.session.regenerate(() => true);
      });
      return {
        status: LogoutStatus.Success,
      };
    },

    async authenticate(_root, { code }, ctx) {
      if (!ctx.req.session.codeVerifier) {
        throw new GraphQLError("authorization failed", {
          extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
        });
      }
      try {
        const user = await ctx.authService.getUser({
          code,
          codeVerifier: ctx.req.session.codeVerifier,
        });

        ctx.req.session.userId = user.id;
        ctx.req.session.save();
        ctx.req.session.regenerate(() => null);

        return {
          user,
        };
      } catch (err) {
        ctx.req.session.userId = null;
        throw err;
      } finally {
        ctx.req.session.codeVerifier = undefined;
      }
    },
  },
};
