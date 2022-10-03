module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",

  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },

  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        project: "api/tsconfig.json",
      },
    },
  },

  plugins: ["@typescript-eslint"],

  ignorePatterns: ["**/generated/**", "dist"],

  overrides: [
    {
      files: ["src/graphql/**/type-defs.ts"],
      processor: "@graphql-eslint/graphql",
    },
    {
      files: ["*.graphql"],
      parser: "@graphql-eslint/eslint-plugin",
      plugins: ["@graphql-eslint"],
      rules: {
        "@graphql-eslint/known-type-names": "error",
      },
      parserOptions: {
        schema: "src/graphql/generated/schema.graphql",
      },
    },
  ],

  rules: {
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: ["*.config.ts", "**/__tests__/**"],
      },
    ],

    "linebreak-style": ["error", "unix"],

    "import/order": [
      "error",
      {
        groups: ["builtin", "external", "internal", "parent", "sibling", "index", "object"],
        "newlines-between": "always",
        alphabetize: { order: "asc", caseInsensitive: true },
      },
    ],
    "import/default": "off",
    "import/no-named-as-default-member": "off",
    "import/no-named-as-default": "off",

    "@typescript-eslint/no-unused-vars": ["error"],

    "@typescript-eslint/explicit-function-return-type": ["off"],
    "@typescript-eslint/explicit-module-boundary-types": ["off"],
    "@typescript-eslint/no-empty-function": ["off"],

    "prettier/prettier": ["error", {}, { usePrettierrc: true }],

    "@typescript-eslint/no-empty-interface": [
      "error",
      {
        allowSingleExtends: true,
      },
    ],
  },
};
