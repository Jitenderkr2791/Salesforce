// pages/login.page.js
import BasePage from './base.page.js';
import loginPageLocators from '../pageobjects/loginPageLocators.js';
import { salesforceUsername, salesforcePassword } from '../config.js';
import CommonMethods from './commonmethods.js';

export default class LoginPageMethods extends CommonMethods
{
    homeUrlPattern =/lightning\/page\/home/;      // Salesforce Home URL Pattern
    homeUrl = 'https://resourceful-impala-ehughf-dev-ed.trailblaze.lightning.force.com/lightning/page/home';
    
    errorLocator = this.page.locator(loginPageLocators.errorLocator);
    otpLocator = this.page.locator(loginPageLocators.otpInput).first();
  
      async getPageType()              //  PAGE TYPE DETECTION (TITLE BASED)
      {
        const title = await this.getTitle();
        const url = this.page.url();
        if (title.includes('Verify Your Identity | Salesforce')) return 'otp';
        if (title.includes('Check Your Mobile Device | Salesforce')) return 'auth';
        if (title.includes('App Launcher | Salesforce')) return 'app'
        if (url.includes('/lightning/page/home')) return 'home';
        return 'unknown';
      }

      async ensureOnHomePage() 
      {   const currentUrl = this.page.url();
          if (this.homeUrlPattern.test(currentUrl)) 
            {
              console.log('Already on Home Page');
              return;
            }
        console.log(' Navigating to Home Page...');
        await this.page.goto(this.homeUrl, { waitUntil: 'load' });
        await this.page.waitForURL(this.homeUrlPattern, { timeout: 20000 });
      }

    // Enter Username & Password
    async enterCredentials()
    {
      await this.waitAndFill(loginPageLocators.userNameInput,salesforceUsername );
      await this.waitAndFill(loginPageLocators.passwordInput,salesforcePassword);
      await this.waitAndClick(loginPageLocators.loginButton);
    }
  
  async clickVerifyButton()
  { 
    await this.waitAndClick(loginPageLocators.verifyButton);   // Click Verify Button
  }

  // Wait For Valid 6 Digit OTP
    async waitForSixDigitOtpFromInput()
    {
      const re = /^\d{6}$/;
          for (let i = 0; i < 12; i++)
            {
                    await this.otpLocator.waitFor({ state: 'visible', timeout: 5000 });          // Wait for OTP field (agar nahi mila to error aayega - jo sahi hai)
                    const val = (await this.otpLocator.inputValue()).trim();
                      if (re.test(val)) {  return val } ;                                   // valid OTP mil gaya
                  await this.page.waitForTimeout(10000);                                      // 10 sec wait before retry
            }
      throw new Error('Timeout waiting for 6-digit OTP.');
    }
  
  // Reusable OTP Flow
      async performOtpFlow(maxOtpAttempts = 3)
      {
        console.log(' Starting OTP Flow...');
        await this.otpLocator.waitFor({state: 'visible',timeout: 60000});   // Wait for OTP Screen
        for ( let attempt = 1;attempt <= maxOtpAttempts;attempt++)
        {
         const otp = await this.waitForSixDigitOtpFromInput();
         console.log(` OTP Attempt #${attempt}`);
         console.log(` OTP Entered: ${otp}`);
         await this.otpLocator.fill(otp);               // Fill OTP
         await this.clickVerifyButton();               // Click Verify
              try {
                    await this.page.waitForTimeout(3000);
                    const pageType = await this.getPageType();             //  CHECK USING TITLE

                     if (pageType === 'home' || pageType === 'app' || pageType ==='unknown') 
                      {
                        await this.ensureOnHomePage();
                        return;
                      }

                     if (pageType === 'otp') 
                      {
                        console.log(' Wrong OTP → retrying...');
                        await this.otpLocator.fill('');
                        continue;
                        }
                    console.log(' Unexpected page → retrying...');
                  } catch (e){
                     throw new Error(`OTP submit failed: ${this.page.url()}`);
                  }
                }
        throw new Error(`OTP failed after ${maxOtpAttempts} attempts`);
      }
  
  async loginSmartHybrid({maxOtpAttempts = 3, authTimeout = 120000} = {})
  {
    console.log(' Starting Salesforce Login...');
    await this.enterCredentials();
    const deadline = Date.now() + authTimeout;
    const checkInterval = 10000;         // 10 seconds

    while (Date.now() < deadline)
    {
      const pageType = await this.getPageType();
      const title = await this.getTitle();

      console.log(`🕒 ${new Date().toLocaleTimeString()}`);
      console.log(` Title: ${title}`);
      console.log(' Page Type:', pageType);
      console.log('---------------------------');
      
      if (pageType === 'home'||pageType === 'app'|| pageType ==='unknown')     // ✅ DIRECT LOGIN
        {
          await this.ensureOnHomePage();
          return;
        }

      if (pageType === 'otp')            // ✅ OTP PAGE
        {
        await this.performOtpFlow(maxOtpAttempts);
        return;
       }

      if (pageType === 'auth')        // ✅ AUTHENTICATOR PAGE  
        {
           console.log(' Waiting for mobile approval...');
             try {
                  await this.page.waitForURL(this.homeUrlPattern, {timeout: checkInterval});
                  console.log(' Approved via mobile');
                  console.log(' Login successful:', this.page.url());
                  await this.ensureOnHomePage();
                  return;
                 } 
            catch {
                  console.log('Approved via mobile but redirected to Page:',this.page.url());            // ❗ NO RETURN HERE → loop continue karega 
                  }
        }
          console.log(' Waiting for correct page...');
          await this.page.waitForTimeout(checkInterval);
        }
    console.log(' Timeout → fallback to OTP');
    await this.performOtpFlow(maxOtpAttempts);
    await this.ensureOnHomePage();
  }

  /*async selectApp(value) {
    await this.enterAndSelectFromValueDropDown(
      loginPageLocators.appLauncher,
      loginPageLocators.appLauncherTextPlaceholder,
      String(value)
    );
  }*/
}