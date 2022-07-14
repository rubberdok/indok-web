import { extendType, nonNull, stringArg } from "nexus";
import { User } from "../users";

export const authenticate = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("authenticate", {
      type: User,
      args: {
        code: nonNull(stringArg()),
      },
      resolve: async (_root, { code }, ctx) => {
        return ctx.service.auth.authenticate(code);
      },
    });
  },
});
