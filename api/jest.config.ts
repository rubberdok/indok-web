/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  preset: "ts-jest",
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: false,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage/unit",

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",

  // The glob patterns Jest uses to detect test files
  testMatch: ["**/__tests__/unit/**/*.test.ts", "**/?(*.)+unit.test.ts"],

  modulePathIgnorePatterns: ["<rootDir>/dist/"],

  // A map from regular expressions to paths to transformers
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"],
  },
};
