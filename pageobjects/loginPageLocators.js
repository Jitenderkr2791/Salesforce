 const loginPageLocators =
{ 
    userNameInput : "//input[@id='username']",
    passwordInput :  "//input[@id='password']",
    loginButton : "//input[@id='Login']",
    otpInput : "//input[@type='text']",
    verifyButton : "//input[@title='Verify']",
    errorLocator : "//div[contains(text(),'Invalid or expired verification code. Try again.')]",
    havingTrouble : "//a[contains(text(),'Having Trouble?')]",
    differentVerificationMethod : "//a[contains(text(),'Use a Different Verification Method')]"
}
export default loginPageLocators;