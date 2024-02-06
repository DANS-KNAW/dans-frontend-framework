import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },

  hosts: { localhost: "127.0.0.1" },
  env: {
    auth_base_url: "https://keycloak.dansdemo.nl",
    auth_realm: "ohsmart",
    auth_client_id: "ohsmart-auth",
    redirect_uri: "https://ohsmart.dansdemo.nl/signin-callback",
  },

  e2e: {
    baseUrl: "https://ohsmart.dansdemo.nl",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
