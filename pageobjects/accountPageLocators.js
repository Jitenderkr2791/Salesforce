const  accountPageLocators = 
    { 
        accountNameInput: "(//input[@name='Name'])[1]",

        OppoPagenewAccount :"//span[text()='New Account']",
        OppoPageAccountNameInput :"//h2[text()='New Account']/ancestor::div[contains(@class,'modal')]//input[@name='Name']",
        OppoPageNewAccountSaveButton :"//h2[text()='New Account']/ancestor::div[contains(@class,'modal')]//button[@name='SaveEdit']",
    };
export default accountPageLocators;