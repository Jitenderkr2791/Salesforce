import BasePage from './base.page.js';
import commonLocators from '../pageobjects/commonLocators.js';
import contactPageLocators from '../pageobjects/contactPageLocators.js';
import OpportunityPageMethods from './opportunity.page.js';

export default class ContactPageMethods extends BasePage
{
    async navigateToContactsTab()
    {
        await this.waitAndClick(contactPageLocators.contactHeaderTab);;
    }
    
    async clickNewButton()  
        {
          await this.waitAndClick(contactPageLocators.conatctNewButton);
        }

    async enterLastName(lastName)
    {
        await this.waitAndType(contactPageLocators.lastNameInput,String(lastName));
    }

    async clickSaveButton()
    {        
        await this.waitAndClick(contactPageLocators.saveButton);
    }


    async createNewContact(testData)
    {   
        await this.navigateToContactsTab();
        await this.clickNewButton();
        await this.enterLastName(testData.contact.lastName);
        const opportunity = new OpportunityPageMethods(this.page);
        await opportunity.enterAccountName(testData.account.accountName);
        await this.clickSaveButton();
        await this.verifyToastMessage("Contact", testData.contact.lastName);
        await this.closeToastMessage();
    }


}