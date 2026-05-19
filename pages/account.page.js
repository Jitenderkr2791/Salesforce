import BasePage from './base.page.js';
import accountPageLocators from '../pageobjects/accountPageLocators.js';

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

    /*async verifyAccountCreation()
    {
        const successMessageLocator = `//span[contains(text(),'${userData.accountName} was created.')]`;
        await this.page.waitForSelector(successMessageLocator, { timeout: 10000 });
    }*/

    async createNewAccount(accountName)
    {   
        await this.navigateToAccountsTab();
        await this.clickNewButton();
        await this.enterAccountName(accountName);
        await this.clickSaveButton();
        //await this.verifyAccountCreation();
    }   

}