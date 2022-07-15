import { makeSchema } from "nexus";
import * as Scalars from "./scalars";
import * as Users from "./users";
import * as Auth from "./auth";
export { Context } from "../context";

export const schema = makeSchema({
  types: [Users, Scalars, Auth],
  outputs: {
    schema: __dirname + "/generated/schema.graphql",
    typegen: __dirname + "/generated/typings.ts",
  },
  contextType: {
    module: __dirname,
    export: "Context",
  },
});
