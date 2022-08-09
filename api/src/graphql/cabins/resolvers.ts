import { GraphQLError } from "graphql";
import { ApolloServerErrorCode } from "@apollo/server/errors";
import { OverlappingBookingError } from "../../services/cabins";

import { ZodError } from "zod";

import { Resolvers } from "../generated/types";

const resolvers: Resolvers = {
  Mutation: {
    newBooking: async (_root, { data }, ctx) => {
      try {
        return await ctx.cabinService.newBooking(data);
      } catch (err) {
        if (err instanceof ZodError) {
          throw new GraphQLError(err.message, {
            extensions: {
              code: ApolloServerErrorCode.BAD_USER_INPUT,
            },
          });
        }
        throw err;
      }
    },

    updateBookingStatus: async (_root, { id, status }, ctx) => {
      if (!ctx.req.session.user) throw new Error("User not logged in");
      try {
        return await ctx.cabinService.updateBookingStatus(
          ctx.req.session.user,
          id,
          status
        );
      } catch (err) {
        if (err instanceof OverlappingBookingError) {
          throw new GraphQLError(err.message, {
            extensions: {
              code: ApolloServerErrorCode.BAD_USER_INPUT,
            },
          });
        }
        throw err;
      }
    },
  },

  Booking: {
    cabin: (booking, _args, ctx) => {
      return ctx.cabinService.getCabin(booking.cabinId);
    },
  },
};

export default resolvers;
