module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "next/core-web-vitals",
    "plugin:prettier/recommended",
  ],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        project: "./tsconfig.json",
      },
    },
    react: {
      version: "detect",
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
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
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
};
