import { test, expect } from '@playwright/test';
import { salesforceUrl } from '../config.js';
import LoginPageMethods from '../pages/login.page.js';
import AccountPageMethods from '../pages/account.page.js';
import OpportunityPageMethods from '../pages/opportunity.page.js';
import { generateAccountData, generateOpportunityData, getTestData } from '../test-data/testDataGenerator.js';

test.describe.serial('Login to Salesforce', () => {
  let page, context;
  let login, opportunity;
  let testData;
  let account ;

    test.beforeAll(async ({ browser }) => 
      {     
        context = await browser.newContext();
        page = await context.newPage();
        login = new LoginPageMethods(page);
        await page.goto(salesforceUrl);
        await login.loginSmartHybrid({maxOtpAttempts: 3, authTimeout: 30000});
        console.log(' Login successfully.');
      });

    test.afterAll(async () => 
          {     
            await context.close(); 
            });
      
    test('Step 1 - create new account via Standard Process', async () => 
        { 
            generateAccountData(); 
            const testData = getTestData();
            account = new AccountPageMethods(page);                      
            await account.createNewAccount(testData.account);
         });

    test('Step 2 - create new opportunity via Standard Process', async () => 
        {
            generateOpportunityData(); 
            const testData = getTestData();                      // Read latest data
            opportunity = new OpportunityPageMethods(page);    
            await opportunity.createNewOpportunity
            (
              testData.opportunity.opportunityName, 
              testData.opportunity.accountName, 
              testData.opportunity.closeDate, 
              testData.opportunity.stage
            );
       });

       test('Step 3 - create Opportunity via Account related tab', async () => 
       {    
            const testData = getTestData();
            opportunity = new OpportunityPageMethods(page);
            await opportunity.createNewOpportunityViaAccountRelatedTab
            (
              testData.account.accountName, 
              testData.opportunity.opportunityName, 
              testData.opportunity.closeDate, 
              testData.opportunity.stage
            );    
       });   

       test('Step 4 - create Account Created Via Opportunity', async () =>
       {
          generateAccountData(); 
          generateOpportunityData();
          const testData = getTestData();
          account = new AccountPageMethods(page); 
          await account.createAccountViaOpportunityCreation
          (
            testData.opportunity.opportunityName,
            testData.account.accountName,
            testData.opportunity.closeDate, 
            testData.opportunity.stage
          );
      });



      
});