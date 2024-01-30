import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  ignoreNoDocuments: true,
  generates: {
    "./src/gql/pages/": {
      schema: "http://localhost:4000/graphql",
      documents: ["src/(pages|components|layouts)/**/*.{ts,tsx}"],
      preset: "client-preset",
      config: {
        avoidOptionals: true,
      },
      presetConfig: {
        fragmentMasking: false,
      },
    },
    "./src/gql/app/": {
      schema: "http://localhost:4000/graphql",
      documents: ["src/app/v2/**/*.{ts,tsx}"],
      preset: "client-preset",
      config: {
        avoidOptionals: true,
      },
      presetConfig: {
        fragmentMasking: false,
      },
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
