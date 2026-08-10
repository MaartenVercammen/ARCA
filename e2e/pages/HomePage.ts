import { Page } from "@playwright/test";

export class HomePage {
    constructor(private page: Page) {}

    async isVisible() {
        return await this.page.isVisible(".home-page");
    }

    async getUrl() {
        return this.page.url();
    }
}
