import { Resolvers } from "../generated/types";

export const resolvers: Resolvers = {
  Mutation: {
    async newBooking(_root, { data }, ctx) {
      return await ctx.cabinService.newBooking(data);
    },

    async updateBookingStatus(_root, { id, status }, ctx) {
      if (!ctx.req.session.userId) throw new Error("User not logged in");
      return await ctx.cabinService.updateBookingStatus(id, status);
    },
  },

  Booking: {
    cabin(booking, _args, ctx) {
      return ctx.cabinService.getCabin(booking.cabinId);
    },
  },
};
