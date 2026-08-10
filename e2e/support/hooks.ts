import { Before, After, BeforeAll, AfterAll, Status } from "@cucumber/cucumber";
import { chromium, Browser, BrowserContext, Page } from "@playwright/test";

let browser: Browser;
let context: BrowserContext;
let page: Page;

BeforeAll(async function () {
    browser = await chromium.launch({ headless: true });
});

Before(async function () {
    context = await browser.newContext();
    page = await context.newPage();
    this.page = page;
});

After(async function (scenario) {
    if (scenario.result?.status === Status.FAILED) {
        await this.page.screenshot({ path: `screenshots/${scenario.pickle.name}.png` });
    }
    await this.page.close();
    await context.close();
});

AfterAll(async function () {
    await browser.close();
});
