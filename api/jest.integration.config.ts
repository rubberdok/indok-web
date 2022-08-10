import base from "./jest.config";
/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  ...base,
  testMatch: ["**/__tests__/integration/**/*.test.ts", "**/?(*.)+integration.test.ts"],
};
