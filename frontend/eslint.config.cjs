const { defineConfig } = require("eslint/config");

const globals = require("globals");
const nextCoreWebVitals = require("eslint-config-next/core-web-vitals");
const nextTypescript = require("eslint-config-next/typescript");
const prettierPlugin = require("eslint-plugin-prettier");

module.exports = defineConfig([
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "coverage/**",
      "next-env.d.ts",
      "src/gql/**",
      "src/generated/**",
      "**/*.generated.{ts,tsx,js,jsx}",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      prettier: prettierPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "prettier/prettier": [
        "warn",
        {},
        {
          usePrettierrc: true,
        },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "import/default": "off",
      "import/no-named-as-default-member": "off",
      "import/no-named-as-default": "off",
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index", "object"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "@typescript-eslint/no-empty-interface": [
        "error",
        {
          allowSingleExtends: true,
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: ["@mui/*/*/*", "!@mui/material/test-utils/*"],
          paths: [
            {
              name: "yup",
              message:
                "Please import it from `'@/lib/validation'` instead to get the pre-configured yup instance. Example `import * as yup from '@/lib/validation'`",
            },
            {
              name: "dayjs",
              message:
                "Please import it from `'@/lib/date'` instead to get the pre-configured dayjs instance. Example: `import dayjs from '@/lib/date'`",
            },
          ],
        },
      ],
    },
  },
]);
