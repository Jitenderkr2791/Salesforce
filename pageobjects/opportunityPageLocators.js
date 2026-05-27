const opportunityPageLocators =
{ 
        opportunitiesHomeTab: "a[title='Opportunities']",
        opportunityNewButton: "div[title='New']",
        opportunityNameInput: "//input[@name='Name' and @type='text']",
        accountNameInput: "input[role='combobox'][aria-label='Account Name']",
        accountDropdownOptions: "lightning-base-combobox-formatted-text",
        closeDateInput: "input[name='CloseDate']",
        stageDropdown: "button[aria-label='Stage']",
        stageOption: "lightning-base-combobox-item[role='option']",
        saveButton:"//h2[text()='New Opportunity']/ancestor::div[contains(@class,'modal')]//button[@name='SaveEdit']",
        successMessage: "span[contains(text(),'was created.')]",


        searchAccountInput:"//input[@name='Account-search-input']",
        //accountSearchIcon :"svg.slds-input__icon_left",
        accountLink: (accountName) => `//a[@title='${accountName}']`,
        accountRelatableTab: "//a[@data-tab-value='relatedListsTab']",
        accountOpportunityNewTab:"//button[@name='New']",
}
export default opportunityPageLocators