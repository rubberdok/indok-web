import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "../backend/**/schema.json",
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    "./src/generated/graphql.tsx": {
      documents: ["src/graphql/**/*.graphql"],
      plugins: ["typescript", "typescript-operations", "typed-document-node"],
      config: {
        scalars: { Date: "string", DateTime: "string", Decimal: "number", UUID: "string" },
      },
    },
    "./src/gql/": {
      documents: ["src/**/*.{tsx,ts}"],
      presetConfig: {
        fragmentMasking: false,
      },
      config: {
        nonOptionalTypename: true,
        scalars: { Date: "string", DateTime: "string", Decimal: "number", UUID: "string" },
      },
      preset: "client",
    },
  },
};

export default config;
