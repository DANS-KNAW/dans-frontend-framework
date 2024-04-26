import { Page } from "@playwright/test";
import { clickAndFill } from "../utils";

export class AdministrativePage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async openTab() {
    await this.page.getByRole("button", { name: "Administrative" }).click();
  }

  async fillOut() {
    // Set language, testid for dropdown is not unique
    await this.page.getByRole("combobox", { name: "Language *" }).fill("dutch");
    await this.page.getByRole("option", { name: "Dutch" }).click();

    // set embargo date
    await clickAndFill(this.page, "date_available-*", "13-12-2011");

    // set affiliation
    await clickAndFill(this.page, "contact_affiliation-*", "DANS Affiliation");
  }
}
