import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  ignoreNoDocuments: true,
  generates: {
    "./src/gql/pages/": {
      schema: [{"http://localhost:4000/graphql": { headers: { "apollo-require-preflight": "1"}}}],
      
      documents: ["src/(pages|components|layouts)/**/*.{ts,tsx}"],
      preset: "client-preset",
      config: { 
        avoidOptionals: true,
      },
      presetConfig: {
        fragmentMasking: { unmaskFunctionName: 'getFragmentData' }
      },
    },
    "./src/gql/app/": {
      schema: [{"http://localhost:4000/graphql": { headers: { "apollo-require-preflight": "1"}}}],
      documents: ["src/app/**/*.{ts,tsx}"],
      preset: "client-preset",
      config: {
        avoidOptionals: true,
      },
      presetConfig: {
        fragmentMasking: { unmaskFunctionName: 'getFragmentData' }
      }
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
