// pages/opportunity.page.js
import BasePage from './base.page.js';
import opportunityPageLocators from '../pageobjects/opportunityPageLocators.js';
import accountPageLocators from '../pageobjects/accountPageLocators.js';

export default class OpportunityPageMethods extends BasePage
{
    constructor(page)
    {
      super(page);
      this.page = page;
    }

    async navigateToOpportunityTab()
    {
      await this.waitAndClick(opportunityPageLocators.opportunitiesHomeTab);
    }

    async OpportunityNewButton()
    {
      await this.waitAndClick(opportunityPageLocators.opportunityNewButton);      // WAIT for modal/input to appear
      await this.page.locator(opportunityPageLocators.opportunityNameInput).waitFor({ state: 'visible', timeout: 30000 });
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

    async createNewOpportunity(opportunityName, accountName, closeDate, stage)
    {
      await this.navigateToOpportunityTab();
      await this.OpportunityNewButton();
      await this.enterOpportunityName(opportunityName);
      await this.enterAccountName(accountName);
      await this.enterCloseDate(closeDate);
      await this.selectStage(stage);
      await this.clickSaveButton();
    }

    async clickRelatedTab()
    {
        await this.waitAndClick(opportunityPageLocators.accountRelatableTab);
    }

    async clickRelatedTabNewOpportunityButton()
    {
        await this.waitAndClick(opportunityPageLocators.accountOpportunityNewTab);
    }
    
    async createNewOpportunityViaAccountRelatedTab(accountName,opportunityName,closeDate,stage)
    {
        await this.waitAndClick(accountPageLocators.accountsHomeTab);
        await this.waitAndType(opportunityPageLocators.searchAccountInput, String(accountName));
        await this.page.keyboard.press('Enter');
        await this.waitAndClick(opportunityPageLocators.accountLink(accountName));
        await this.clickRelatedTab();
        await this.clickRelatedTabNewOpportunityButton();
        await this.enterOpportunityName(opportunityName);
        await this.enterCloseDate(closeDate);
        await this.selectStage(stage);
        await this.clickSaveButton();
    }
}