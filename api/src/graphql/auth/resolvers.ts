import { ApolloServerErrorCode } from "@apollo/server/errors";
import { GraphQLError } from "graphql";
import { Resolvers } from "../generated/types";

const resolvers: Resolvers = {
  Mutation: {
    redirectUrl: async (_root, { state }, ctx) => {
      const { url, codeVerifier } = ctx.authService.ssoUrl(state);
      ctx.req.session.codeVerifier = codeVerifier;
      return url;
    },
    logout: async (_root, _args, ctx) => {
      ctx.req.session.user = null;
      ctx.req.session.save(() => {
        ctx.req.session.regenerate(() => true);
      });
      return true;
    },
    authenticate: async (_root, { code }, ctx) => {
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
        ctx.req.session.user = user;
        ctx.req.session.save();
        ctx.req.session.regenerate(() => null);
        return user;
      } catch (err) {
        ctx.req.session.user = null;
        throw err;
      } finally {
        ctx.req.session.codeVerifier = undefined;
      }
    },
  },
};

export default resolvers;
