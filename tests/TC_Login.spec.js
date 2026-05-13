import { test, expect } from '@playwright/test';
import { logintoSalesforceUrl } from '../config.js';
import LoginPageMethods from '../pages/login.page.js'; 
test.setTimeout(180000);

test.describe.serial('Login to Salesforce', () => {
  let page;
  let login;
  let context;

    test.beforeAll(async ({ browser }) => {
        context = await browser.newContext();
        page = await context.newPage();
        login = new LoginPageMethods(page);
        await page.goto(logintoSalesforceUrl);        // Go to application start page once
      });

      //  Step 1 - login
      test('Step 1 - login', async () => {
        await login.loginSmartHybrid();
        console.log(' Login successfully.');
      });
});