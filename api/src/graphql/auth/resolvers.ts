import { ApolloServerErrorCode } from "@apollo/server/errors";
import { GraphQLError } from "graphql";
import { Resolvers } from "../generated/types";

const resolvers: Resolvers = {
  Mutation: {
    redirectUrl: async (_root, { state }, ctx) => {
      const { url, encryptedCodeVerifier } = ctx.authService.ssoUrl(state);
      ctx.req.session.codeVerifier = encryptedCodeVerifier;
      return url;
    },
    logout: async (_root, _args, ctx) => {
      ctx.req.session.destroy(() => null);
      return true;
    },
    authenticate: async (_root, { code }, ctx) => {
      console.log(ctx.req.session);
      if (!ctx.req.session.codeVerifier) {
        throw new GraphQLError("authorization failed", {
          extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
        });
      }
      try {
        const user = await ctx.authService.getUser({
          code,
          encryptedCodeVerifier: ctx.req.session.codeVerifier,
        });

        ctx.req.session.user = user;
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
