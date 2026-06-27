import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";

Given("I am on the login page", async function () {
    this.loginPage = new LoginPage(this.page);
    await this.loginPage.navigate();
});

When("I enter valid credentials", async function () {
    await this.loginPage.enterCredentials("validUser", "validPass123");
});

When("I click the login button", async function () {
    await this.loginPage.clickLogin();
});

Then("I should be redirected to the home page", async function () {
    this.homePage = new HomePage(this.page);
    await expect(this.page).toHaveURL(/\/home/);
});

When("I enter credentials for a non-existent user", async function () {
    await this.loginPage.enterCredentials("nonExistentUser", "anyPass");
});

Then("I should see an error message {string}", async function (message: string) {
    const error = await this.loginPage.getErrorMessage();
    expect(error).toContain(message);
});

Then("I should see an option to register", async function () {
    const isVisible = await this.loginPage.isRegisterOptionVisible();
    expect(isVisible).toBe(true);
});

When("I click the register option", async function () {
    await this.loginPage.clickRegister();
});

Then("I should be redirected to the registration page", async function () {
    await expect(this.page).toHaveURL(/\/register/);
});
