import BasePage from './base.page.js';
import accountPageLocators from '../pageobjects/accountPageLocators.js';
import opportunityPageLocators from '../pageobjects/opportunityPageLocators.js';
import OpportunityPageMethods from './opportunity.page.js';

export default class AccountPageMethods extends BasePage
{  
    constructor(page)
    {
        super(page); 
        this.page = page;
    }

    async navigateToAccountsTab()
    {
        await this.waitAndClick(accountPageLocators.accountsHomeTab);
    }

    async clickNewButton()  
    {
        await this.waitAndClick(accountPageLocators.accountNewButton);
    }

    async enterAccountName(accountName)
    {
        await this.waitAndType(accountPageLocators.accountNameInput,String(accountName));
    }
    
    async clickSaveButton()
    {        
        await this.waitAndClick(accountPageLocators.saveButton);
    }

/*
    async verifyAccountCreation()
    {
        const successMessageLocator = `//span[contains(text(),'${testData.accountName} was created.')]`;
        await this.page.waitForSelector(successMessageLocator, { timeout: 10000 });
    } */

    async createNewAccount(testData)
    {   
        await this.navigateToAccountsTab();
        await this.clickNewButton();
        await this.enterAccountName(testData.accountName);
        await this.clickSaveButton();
       // await this.verifyAccountCreation();
    }   


    async clickOppoPagenewAccount()
    {
        await this.waitAndClick(accountPageLocators.OppoPagenewAccount);
    }

    async enterOppoPageNewAccountInput(accountName)
    {
        await this.waitAndType(accountPageLocators.OppoPageAccountNameInput,String(accountName));
    }

    async clickOppoPageNewAccountSaveButton()
    {        
        await this.waitAndClick(accountPageLocators.OppoPageNewAccountSaveButton);
    }
    
    async createAccountViaOpportunityCreation(opportunityName, accountName, closeDate, stage)
    {
        const opportunity = new OpportunityPageMethods(this.page);
        await opportunity.navigateToOpportunityTab();
        await opportunity.OpportunityNewButton();
        await opportunity.enterOpportunityName(opportunityName);
        await this.waitAndClick(opportunityPageLocators.accountNameInput);
        await this.clickOppoPagenewAccount();
        await this.enterOppoPageNewAccountInput(accountName);
        await this.clickOppoPageNewAccountSaveButton();
        await opportunity.enterCloseDate(closeDate);
        await opportunity.selectStage(stage)
        await opportunity.clickSaveButton();
    }
    
}