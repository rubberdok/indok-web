import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "../backend/**/schema.json",
  generates: {
    "./src/gql/": {
      documents: ["src/app/**/*.{ts,tsx}"],
      preset: "client-preset",
      config: {
        avoidOptionals: true,
      },
      presetConfig: {
        fragmentMasking: false,
      },
    },
    "src/generated/graphql.tsx": {
      documents: "src/graphql/**/*.graphql",
      plugins: ["typescript", "typescript-operations", "typed-document-node"],
    },
  },
  config: {
    scalars: {
      Date: "string",
      DateTime: "string",
      Decimal: "number",
      UUID: "string",
    },
  },
};

export default config;
