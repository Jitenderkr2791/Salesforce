import BasePage from './base.page.js';
import commonLocators from '../pageobjects/commonLocators.js';
import accountPageLocators from '../pageobjects/accountPageLocators.js';
import opportunityPageLocators from '../pageobjects/opportunityPageLocators.js';
import OpportunityPageMethods from './opportunity.page.js';

export default class AccountPageMethods extends BasePage
{  
    async navigateToAccountsTab()
    {
        await this.waitAndClick(accountPageLocators.accountsHomeTab);
    }

    async enterAccountName(accountName)
    {
        await this.waitAndType(accountPageLocators.accountNameInput,String(accountName));
    }
    
    async clickSaveButton()
    {        
        await this.waitAndClick(accountPageLocators.saveButton);
    }

    async createNewAccount(testData)
    {   
        await this.navigateToAccountsTab();
        await this.clickNewButton();
        await this.enterAccountName(testData.account.accountName);
        await this.clickSaveButton();
        await this.verifyToastMessage("Account", testData.account.accountName);
        await this.closeToastMessage();
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
    
    async createAccountViaOpportunityCreation(testData)
    {
        const opportunity = new OpportunityPageMethods(this.page);
        await opportunity.navigateToOpportunityTab();
        await this.clickNewButton();
        await opportunity.enterOpportunityName(testData.opportunity.opportunityName);
        await this.waitAndClick(opportunityPageLocators.accountNameInput);
        await this.clickOppoPagenewAccount();
        await this.enterOppoPageNewAccountInput(testData.account.accountName);
        await this.clickOppoPageNewAccountSaveButton();
        await this.verifyToastMessage("Account", testData.account.accountName);
        await this.closeToastMessage();
        await opportunity.enterCloseDate(testData.opportunity.closeDate);
        await opportunity.selectStage(testData.opportunity.stage);
        await opportunity.clickSaveButton();
        await this.verifyToastMessage("Opportunity", testData.opportunity.opportunityName);
        await this.closeToastMessage();
    }
    
}