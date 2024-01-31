/// <reference types="cypress" />

import { getAuthCodeFromLocation } from "./authUtils";

Cypress.Commands.add("kcLogin", (user: string) => {
    Cypress.log({ name: "Login" });

    cy.fixture(`users/${user}`).then((userData: UserData) => {
        const authBaseUrl = Cypress.env("auth_base_url");
        const realm = Cypress.env("auth_realm");
        const client_id = Cypress.env("auth_client_id");
        const redirect_uri = Cypress.env("redirect_uri")

        cy.request({
            url: `${authBaseUrl}/realms/${realm}/protocol/openid-connect/auth`,
            followRedirect: false,
            qs: {
                client_id,
                redirect_uri,
                scope: "openid",
                response_type: "code",
                approval_prompt: "auto",
            },
        })
            .then((response) => {
                const html = document.createElement("html");
                html.innerHTML = response.body;
                
                // select the form via the id, kc-form-login.
                const form = cy.get('#kc-form-login');

                const url = form.action;

                return cy.request({
                    method: "POST",
                    url,
                    followRedirect: false,
                    form: true,
                    body: {
                        username: userData.username,
                        password: userData.password,
                    },
                });
            })
            .then((response) => {
                const code = getAuthCodeFromLocation(
                    response.headers["location"] as string,
                );

                cy.request({
                    method: "post",
                    url: `${authBaseUrl}/realms/${realm}/protocol/openid-connect/token`,
                    body: {
                        client_id,
                        redirect_uri: redirect_uri,
                        code,
                        grant_type: "authorization_code",
                    },
                    form: true,
                    followRedirect: false,
                }).its("body");
            });
    });
});

Cypress.Commands.add("kcLogout", () => {
    Cypress.log({ name: "Logout" });
    const authBaseUrl = Cypress.env("auth_base_url");
    const realm = Cypress.env("auth_realm");

    return cy.request({
        url: `${authBaseUrl}/realms/${realm}/protocol/openid-connect/logout`,
    });
});

