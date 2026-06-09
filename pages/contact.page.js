import BasePage from './base.page.js';
import commonLocators from '../pageobjects/commonLocators.js';
import contactPageLocators from '../pageobjects/contactPageLocators.js';
import OpportunityPageMethods from './opportunity.page.js';
import CommonMethods from './commonmethods.js';

export default class ContactPageMethods extends CommonMethods
{
    async navigateToContactsTab()
    {
        await this.navigationTab('Contacts');
    }

    async enterLastName(lastName)
    {
        await this.waitAndType(contactPageLocators.lastNameInput,String(lastName));
    }

    async clickSaveButton()
    {        
        await this.clickStandardButton('Contact','SaveEdit');
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