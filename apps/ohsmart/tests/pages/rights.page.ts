import { Page } from "@playwright/test";
import { loadMockDataDropdown } from "../utils";

export class RightsPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async openTab() {
    await this.page
      .getByRole("button", { name: "Rights, licencing and re-use" })
      .click();
  }

  async setRights() {
    const rightsHolderField = this.page
      .getByTestId(RegExp("rightsholder"))
      .nth(1);
    rightsHolderField.click();
    rightsHolderField.fill("DANS Org");
    await loadMockDataDropdown(
      this.page,
      "rights.json",
      "**/expanded-search/?q=*",
    );
    await this.page.getByRole("option", { name: "DANS" }).click();

    const licenceField = this.page.getByTestId(RegExp("licence_type*")).nth(1);
    await licenceField.click();
    await this.page.getByRole("option", { name: "CC BY" }).click();
  }
}
