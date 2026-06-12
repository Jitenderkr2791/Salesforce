const opportunityPageLocators =
{ 
        opportunityNameInput: "//h2[text()='New Opportunity']/ancestor::div[contains(@class,'modal')]//label[contains(.,'Opportunity Name')]/following::input[1]",
        accountNameInput: "//h2[text()='New Opportunity']/ancestor::div[contains(@class,'modal')]//label[contains(.,'Account Name')]/following::input[1]",
        closeDateInput: "//h2[text()='New Opportunity']/ancestor::div[contains(@class,'modal')]//label[contains(.,'Close Date')]/following::input[1]",
        accountDropdownOptions: "(//lightning-base-combobox-item)[2]",
        stageDropdown: "button[aria-label='Stage']",
        stageOption: "lightning-base-combobox-item[role='option']",
        saveButton:"//h2[text()='New Opportunity']/ancestor::div[contains(@class,'modal')]//button[@name='SaveEdit']",
        successMessage: "span[contains(text(),'was created.')]",
      
        stage: "//h2[text()='New Opportunity']/ancestor::div[contains(@class,'modal')]//label[contains(.,'Stage')]/following::button[@role='combobox']",
        probability: "//h2[text()='New Opportunity']/ancestor::div[contains(@class,'modal')]//label[contains(.,'Probability')]/following::input[1]",
        amount: "//h2[text()='New Opportunity']/ancestor::div[contains(@class,'modal')]//label[contains(.,'Amount')]/following::input[1]",
        nextStep: "//h2[text()='New Opportunity']/ancestor::div[contains(@class,'modal')]//label[contains(.,'Next Step')]/following::input[1]",
        type: "//h2[text()='New Opportunity']/ancestor::div[contains(@class,'modal')]//label[contains(.,'Type')]/following::button[@role='combobox']",
        leadSource: "//h2[text()='New Opportunity']/ancestor::div[contains(@class,'modal')]//label[contains(.,'Lead Source')]/following::button[@role='combobox']",
        isPrivate: "//h2[text()='New Opportunity']/ancestor::div[contains(@class,'modal')]//label[contains(.,'Private')]/following::input[@type='checkbox']",

        // Additional Information
        primaryCampaignSource: "//h2[text()='New Opportunity']/ancestor::div[contains(@class,'modal')]//label[contains(.,'Primary Campaign Source')]/following::input[1]",
        orderNumber: "//h2[text()='New Opportunity']/ancestor::div[contains(@class,'modal')]//label[contains(.,'Order Number')]/following::input[1]",
        mainCompetitors: "//h2[text()='New Opportunity']/ancestor::div[contains(@class,'modal')]//label[contains(.,'Main Competitor(s)')]/following::input[1]",
        currentGenerators: "//h2[text()='New Opportunity']/ancestor::div[contains(@class,'modal')]//label[contains(.,'Current Generator(s)')]/following::input[1]",
        deliveryStatus: "//h2[text()='New Opportunity']/ancestor::div[contains(@class,'modal')]//label[contains(.,'Delivery/Installation Status')]/following::button[@role='combobox']",
        trackingNumber: "//h2[text()='New Opportunity']/ancestor::div[contains(@class,'modal')]//label[contains(.,'Tracking Number')]/following::input[1]",

        // Description Information
        description: "//h2[text()='New Opportunity']/ancestor::div[contains(@class,'modal')]//label[contains(.,'Description')]/following::textarea",

        searchAccountInput:"//input[@name='Account-search-input']",
        accountLink: (accountName) => `//a[@title='${accountName}']`,
        accountRelatableTab: "//li[@data-target-selection-name='relatedListsTabTab']",
        accountOpportunityNewTab:"//li[@data-target-selection-name='sfdc:StandardButton.Opportunity.New']",
};
export default opportunityPageLocators; 