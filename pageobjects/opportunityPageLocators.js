const OpportunityPageLocators =
{ 
opportunitiesHomeTab: "a[title='Opportunities']",
opportunityNewButton: "div[title='New']",
opportunityNameInput: "input[name='Name']",

accountNameInput: "input[role='combobox'][aria-label='Account Name']",
accountDropdownOptions: "lightning-base-combobox-formatted-text",

closeDateInput: "input[name='CloseDate']",

stageDropdown: "button[aria-label='Stage']",
stageOption: "lightning-base-combobox-item[role='option']",

saveButton: "button[name='SaveEdit']",
successMessage: "span[contains(text(),'was created.')]"
}
export default OpportunityPageLocators;