const contactPageLocators = 
{
    contactHeaderTab : "//a[@title='Contacts']",
    conatctNewButton : "//span[text()='Contacts']/ancestor::div[contains(@class,'active')]//button[@name='NewContact']",
    lastNameInput : "//h2[text()='New Contact']/ancestor::div[contains(@class,'modal')]//label[contains(.,'Last Name')]/following::input[1]",
    saveButton : "//button[@name='SaveEdit']",
};
export default contactPageLocators;