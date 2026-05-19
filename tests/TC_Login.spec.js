import { test, expect } from '@playwright/test';
import { salesforceUrl } from '../config.js';
import LoginPageMethods from '../pages/login.page.js';
import AccountPageMethods from '../pages/account.page.js';
import OpportunityPageMethods from '../pages/opportunity.page.js';
import { generateAccountData, generateOpportunityData} from '../test-data/testDataGenerator.js';

test.describe.serial('Login to Salesforce', () => {
  let page;
  let login;
  let account;
  let opportunity;
  let context;
  let accountData;
  let opportunityData;

    test.beforeAll(async ({ browser }) => 
      {
        test.setTimeout(310000);  // Set timeout for this hook
        context = await browser.newContext();
        page = await context.newPage();
        login = new LoginPageMethods(page);
        account = new AccountPageMethods(page);
        opportunity = new OpportunityPageMethods(page);
        // Generate fresh data every run
        accountData = generateAccountData();
        opportunityData = generateOpportunityData(accountData.accountName);
        
        await page.goto(salesforceUrl);
        await login.loginSmartHybrid({maxOtpAttempts: 3, authTimeout: 300000});
        console.log(' Login successfully.');
      });
      
      test('Step 1 - create new account', async () => 
        {
        await account.createNewAccount(accountData);
       });

      test('Step 2 - create new opportunity', async () => 
        {
        await opportunity.createNewOpportunity(opportunityData.opportunityName, opportunityData.accountName, opportunityData.closeDate, opportunityData.stage);
       });
    
      test.afterAll(async () => {
        await context.close();
      });
});