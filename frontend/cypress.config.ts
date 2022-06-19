import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    viewportHeight: 1200,
    viewportWidth: 1920,
    chromeWebSecurity: false,
    projectId: "1fyogc",
    experimentalSessionAndOrigin: true,
    defaultCommandTimeout: 20000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    API_URL: "http://localhost:8000",
  },
});
