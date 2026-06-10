// pages/login.page.js
import BasePage from './base.page.js';
import loginPageLocators from '../pageobjects/loginPageLocators.js';
import { salesforceUsername, salesforcePassword } from '../config.js';
import CommonMethods from './commonmethods.js';

export default class LoginPageMethods extends CommonMethods
{
  
    homeUrlPattern =/lightning\/page\/home/; // Salesforce Home URL Pattern
    errorLocator = this.page.locator(loginPageLocators.errorLocator);
    otpLocator = this.page.locator(loginPageLocators.otpInput).first();
    authenticatorPageHeading = this.page.locator(loginPageLocators.authenticatorPageHeading);
    otpPageHeading = this.page.locator(loginPageLocators.otpPageHeading);

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
                    if (re.test(val)) 
                      {
                      return val;                                   // valid OTP mil gaya
                      }
                await this.page.waitForTimeout(10000);                                      // 10 sec wait before retry
          }
    throw new Error('Timeout waiting for 6-digit OTP.');
  }
  
  // Reusable OTP Flow
      async performOtpFlow(maxOtpAttempts = 3)
      {
        console.log(' Starting OTP Flow...');
        const isHeadless = process.env.HEADLESS === 'true';          //  Detect headless mode
        console.log(` Headless Mode: ${isHeadless}`);
        await this.otpLocator.waitFor({state: 'visible',timeout: 60000});   // Wait for OTP Screen
        for ( let attempt = 1;attempt <= maxOtpAttempts;attempt++)
        {
          console.log(` OTP Attempt #${attempt}`);
          let otp;
            if (isHeadless)         //  HEADLESS → TAKE FROM CONSOLE
            {
              otp = await this.getOtpFromConsole();
              console.log(` OTP (console): ${otp}`);
            }
            else
            {
              otp = await this.waitForSixDigitOtpFromInput();    //  HEADED → EXISTING FLOW
              console.log(` OTP (auto): ${otp}`);
            }
          console.log(` OTP Entered: ${otp}`);
          await this.otpLocator.fill(otp);               // Fill OTP
          await this.clickVerifyButton();               // Click Verify

          let result;
              try 
              {
                 result = await Promise.race([
                                       this.page.waitForURL(this.homeUrlPattern, { timeout: 15000 }).then(() => 'success'),
                                       this.errorLocator.waitFor({ state: 'visible', timeout: 15000 }).then(() => 'error')
                                    ]);
              } 
              catch (e)
              {
                throw new Error(`No response after OTP submit. URL: ${this.page.url()}`);
              }

              if (result === 'success') 
                { 
                 console.log(`✅ Login successful: ${this.page.url()}`);
                 return;
                }

              if (result === 'error') 
                {
                const msg = (await this.errorLocator.textContent())?.trim();
                console.log(`❌ OTP Failed: ${msg}`);
                await this.otpLocator.clear();
                await this.page.waitForTimeout(2000);
               }
            }
        throw new Error(`OTP failed after ${maxOtpAttempts} attempts`); // Max Attempts Failed
      }

  
  async loginSmartHybrid({maxOtpAttempts = 1, authTimeout = 60000} = {})
  {
    console.log(' Starting Salesforce Login (Hybrid Mode)...');
    await this.enterCredentials();
    const deadline = Date.now() + authTimeout;
    const checkInterval = 10000; // 10 seconds
    let authenticatorDetected = false;

    while (Date.now() < deadline)
    {
      // Check for direct login success first
      if (this.homeUrlPattern.test(this.page.url()))
      {
        console.log(`Login successful: ${this.page.url()}`);
        console.log('Current URL:', this.page.url());
        return;
      }

      if (await this.otpPageHeading.isVisible().catch(() => false))
      {
        console.log('OTP page detected. Starting OTP flow...');
        await this.performOtpFlow(maxOtpAttempts);
        return;
      }

      if (await this.authenticatorPageHeading.isVisible().catch(() => false))
      {
        if (!authenticatorDetected)
        {
          console.log('Authenticator page detected. Waiting for mobile device approval...');
          authenticatorDetected = true;
        }
        const remainingTime = deadline - Date.now();
        console.log(`Still waiting for approval. ${Math.round(remainingTime / 1000)}s remaining...`);
        await this.page.waitForTimeout(checkInterval).catch(() => {});
        continue;
      }

      console.log(' Waiting for auth page...');
      await this.page.waitForTimeout(checkInterval).catch(() => {});
    }
    console.log(' Timeout → switching to OTP fallback');
    await this.performOtpFlow(maxOtpAttempts);
  }
}