const opportunityPageLocators =
{ 
        opportunitiesHomeTab: "a[title='Opportunities']",
        opportunityNameInput: "//input[@name='Name' and @type='text']",
        accountNameInput: "input[role='combobox'][aria-label='Account Name']",
        accountDropdownOptions: "(//lightning-base-combobox-item)[2]",
        closeDateInput: "input[name='CloseDate']",
        stageDropdown: "button[aria-label='Stage']",
        stageOption: "lightning-base-combobox-item[role='option']",
        saveButton:"//h2[text()='New Opportunity']/ancestor::div[contains(@class,'modal')]//button[@name='SaveEdit']",
        successMessage: "span[contains(text(),'was created.')]",


        searchAccountInput:"//input[@name='Account-search-input']",
        accountLink: (accountName) => `//a[@title='${accountName}']`,
        accountRelatableTab: "//li[@data-target-selection-name='relatedListsTabTab']",
        accountOpportunityNewTab:"//li[@data-target-selection-name='sfdc:StandardButton.Opportunity.New']",
};
export default opportunityPageLocators;