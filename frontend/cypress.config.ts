import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    viewportHeight: 1200,
    retries: {
      runMode: 3,
    },
    viewportWidth: 1920,
    chromeWebSecurity: false,
    projectId: "1fyogc",
    video: false,
    experimentalSessionAndOrigin: true,
    defaultCommandTimeout: 60000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    API_URL: "http://localhost:8000",
  },
});
