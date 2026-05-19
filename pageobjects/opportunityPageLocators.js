const OpportunityPageLocators =
{ 
opportunitiesHomeTab: "//a[@title='Opportunities']",
opportunityNewButton: "//div[@title='New']",
opportunityNameInput: "//input[@name='Name']",
accountNameInput: "//input[@placeholder='Search Accounts...']",
closeDateInput: "//input[@name='CloseDate']",
stageDropdown: "//button[@aria-label='Stage, --None--']",
stageOption : (stage) => `//lightning-base-combobox-item[@data-value='${stage}']`,
saveButton: "//button[@name='SaveEdit']",
successMessage: "//span[contains(text(),'was created.')]"
}
export default OpportunityPageLocators;