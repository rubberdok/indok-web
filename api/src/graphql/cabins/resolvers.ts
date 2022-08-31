import { Resolvers } from "../generated/types";

const resolvers: Resolvers = {
  Mutation: {
    newBooking: async (_root, { data }, ctx) => {
      return await ctx.cabinService.newBooking(data);
    },

    updateBookingStatus: async (_root, { id, status }, ctx) => {
      if (!ctx.req.session.user) throw new Error("User not logged in");
      return await ctx.cabinService.updateBookingStatus(ctx.req.session.user, id, status);
    },
  },

  Booking: {
    cabin: (booking, _args, ctx) => {
      return ctx.cabinService.getCabin(booking.cabinId);
    },
  },
};

export default resolvers;
