// pages/opportunity.page.js
import BasePage from './base.page.js';
import OpportunityPageLocators from '../pageobjects/opportunityPageLocators.js';

export default class OpportunityPageMethods extends BasePage
{
  constructor(page)
  {
    super(page);
    this.page = page;
  }

  async navigateToOpportunityTab()
  {
    await this.waitAndClick(OpportunityPageLocators.opportunitiesHomeTab);
  }
  async OpportunityNewButton()
  {
    await this.waitAndClick(OpportunityPageLocators.OpportunityNewButton);
  }
  async enterOpportunityName(opportunityName)
  {
    await this.waitAndType(OpportunityPageLocators.opportunityNameInput, String(opportunityName));
  } 
  async enterAccountName(accountName)
  {
    await this.selectValueFromDropdown(OpportunityPageLocators.accountNameInput, String(accountName));
  }
  async enterCloseDate(closeDate)
  {
    await this.waitAndType(OpportunityPageLocators.closeDateInput, String(closeDate));
  }
  async selectStage(stage)
  {
    await this.waitAndClick(OpportunityPageLocators.stageDropdown);
    await this.waitAndClick(OpportunityPageLocators.stageOption(stage));
  }
  async clickSaveButton()
  {
    await this.waitAndClick(OpportunityPageLocators.saveButton);
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

}