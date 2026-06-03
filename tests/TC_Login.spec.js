import { test, expect } from '@playwright/test';
import { salesforceUrl } from '../config.js';
import LoginPageMethods from '../pages/login.page.js';
import AccountPageMethods from '../pages/account.page.js';
import OpportunityPageMethods from '../pages/opportunity.page.js';
import ContactPageMethods from '../pages/contact.page.js';
import { generateAccountData, generateOpportunityData, generateContactData, getTestData } from '../test-data/testDataGenerator.js';

test.describe.serial('Login to Salesforce', () => {
  let page, context;
  let login, opportunity, contact;
  let testData;
  let account ;
 
  
    test.beforeAll(async ({ browser }) => 
      { test.setTimeout(120000);
        context = await browser.newContext({viewport: null});
        page = await context.newPage();
        login = new LoginPageMethods(page);
        await page.goto(salesforceUrl);
        await login.loginSmartHybrid({maxOtpAttempts: 1, authTimeout: 60000});
        await page.evaluate(() => {document.body.style.zoom = '100%';});
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
            await account.createNewAccount(testData);
         });

    test('Step 2 - create new opportunity via Standard Process', async () => 
        {
            generateOpportunityData(); 
            const testData = getTestData();                      // Read latest data
            opportunity = new OpportunityPageMethods(page);    
            await opportunity.createNewOpportunity(testData);
       });

    test('Step 3 - create Opportunity via Account related tab', async () => 
       {    
            const testData = getTestData();
            opportunity = new OpportunityPageMethods(page);
            await opportunity.createNewOpportunityViaAccountRelatedTab(testData);    
       });   

    test('Step 4 - create Account Created Via Opportunity', async () =>
       {
          generateAccountData(); 
          generateOpportunityData();
          const testData = getTestData();
          account = new AccountPageMethods(page); 
          await account.createAccountViaOpportunityCreation(testData);
      });
    
    test('Step 5 - create Contact via Standard Process', async () =>
       {    
            const testData = getTestData();
            contact = new ContactPageMethods(page);
            await contact.createNewContact(testData);
       });
});