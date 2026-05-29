import { defineConfig } from "cypress";

export default defineConfig({
  allowCypressEnv: false,
  e2e: {
    baseUrl: "http://localhost:3000",
    viewportHeight: 1200,
    retries: {
      runMode: 3,
      openMode: 0,
    },
    viewportWidth: 1920,
    chromeWebSecurity: false,
    projectId: "1fyogc",
    video: false,
    defaultCommandTimeout: 20000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    API_URL: "http://localhost:8000",
    FEIDE_USERNAME: "asbjorn_elevg",
    FEIDE_PASSWORD: "098asd",
    FEIDE_DISPLAY_NAME: "Asbjørn",
    RUN_FEIDE_E2E: false,
  },
});
