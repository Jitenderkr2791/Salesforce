// pages/opportunity.page.js
import BasePage from './base.page.js';
import opportunityPageLocators from '../pageobjects/opportunityPageLocators.js';
import accountPageLocators from '../pageobjects/accountPageLocators.js';
import commonLocators from '../pageobjects/commonLocators.js';

export default class OpportunityPageMethods extends BasePage
{
    async navigateToOpportunityTab()
    {
       await this.navigateToTab('Opportunities');
    }

    async enterOpportunityName(opportunityName)
    {
      await this.waitAndType(opportunityPageLocators.opportunityNameInput, String(opportunityName));
    } 

    async enterAccountName(accountName)
    {
      await this.waitAndType(opportunityPageLocators.accountNameInput,String(accountName));
      const accountOption = this.page.locator(opportunityPageLocators.accountDropdownOptions);
      await accountOption.first().click();
    }

    async enterCloseDate(closeDate)
    {
      await this.waitAndType(opportunityPageLocators.closeDateInput, String(closeDate));
    }

    async selectStage(stage)
    {
      await this.selectValueFromDropdown(opportunityPageLocators.stageDropdown, opportunityPageLocators.stageOption, String(stage));
    }

    async clickSaveButton()
    {
      await this.waitAndClick(opportunityPageLocators.saveButton);
    }

    async createNewOpportunity(testData)
    {
      await this.navigateToOpportunityTab();
      await this.clickNewButton();
      await this.enterOpportunityName(testData.opportunity.opportunityName);
      await this.enterAccountName(testData.account.accountName);
      await this.enterCloseDate(testData.opportunity.closeDate);
      await this.selectStage(testData.opportunity.stage);
      await this.clickSaveButton();
      await this.verifyToastMessage("Opportunity", testData.opportunity.opportunityName);
      await this.closeToastMessage();
    }

    async clickRelatedTab()
    {
        await this.waitAndClick(opportunityPageLocators.accountRelatableTab);
    }

    async clickRelatedTabNewOpportunityButton()
    {
        await this.waitAndClick(opportunityPageLocators.accountOpportunityNewTab);
    }
    
    async createNewOpportunityViaAccountRelatedTab(testData)
    {
        await this.navigateToTab('Accounts');
        await this.waitAndType(opportunityPageLocators.searchAccountInput, String(testData.account.accountName));
        await this.page.keyboard.press('Enter');
        await this.waitAndClick(opportunityPageLocators.accountLink(testData.account.accountName));
        await this.clickRelatedTab();
        await this.clickRelatedTabNewOpportunityButton();
        await this.enterOpportunityName(testData.opportunity.opportunityName);
        await this.enterCloseDate(testData.opportunity.closeDate);
        await this.selectStage(testData.opportunity.stage);
        await this.clickSaveButton();
        await this.verifyToastMessage("Opportunity", testData.opportunity.opportunityName);
        await this.closeToastMessage();
    }
}