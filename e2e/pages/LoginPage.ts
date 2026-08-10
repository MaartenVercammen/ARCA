import { Page, expect } from "@playwright/test";

export class LoginPage {
    constructor(private page: Page) {}

    async navigate() {
        await this.page.goto("/login");
    }

    async enterCredentials(username: string, password: string) {
        await this.page.fill('input[name="username"]', username);
        await this.page.fill('input[name="password"]', password);
    }

    async clickLogin() {
        await this.page.click('button[type="submit"]');
    }

    async getErrorMessage() {
        return await this.page.textContent(".error-message");
    }

    async clickRegister() {
        await this.page.click('a[href="/register"]');
    }

    async isRegisterOptionVisible() {
        return await this.page.isVisible('a[href="/register"]');
    }
}
