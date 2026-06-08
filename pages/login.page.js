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
      // 120 sec polling
      for (let i = 0; i < 120; i++)
      {
        await this.otpLocator.waitFor({state: 'visible',timeout: 5000 }).catch(() => {});
        const val = (await this.otpLocator.inputValue().catch(() => '')).trim();

        // Valid 6 digit OTP
        if (re.test(val))
        { return val; }
        await this.page.waitForTimeout(10000);
      }
      throw new Error('Timeout waiting for 6-digit OTP.');
    }

  
  // Reusable OTP Flow
  async performOtpFlow(maxOtpAttempts = 3)
  {
    console.log(' Starting OTP Flow...');

      //  Detect headless mode
    const isHeadless = this.page.context().browser()?.options?.headless ?? true;
    console.log(` Headless Mode: ${isHeadless}`);

    // Wait for OTP Screen
    await this.otpLocator.waitFor({state: 'visible',timeout: 60000});
    for ( let attempt = 1;attempt <= maxOtpAttempts;attempt++)
    {
      console.log(` OTP Attempt #${attempt}`);
      const otp = await this.waitForSixDigitOtpFromInput(); // Wait for OTP input
          
      //  HEADLESS → TAKE FROM CONSOLE
        if (isHeadless)
        {
          otp = await this.getOtpFromConsole();
          console.log(` OTP (console): ${otp}`);
        }
        else
        {
          //  HEADED → EXISTING FLOW
          otp = await this.waitForSixDigitOtpFromInput();
          console.log(` OTP (auto): ${otp}`);
        }
  
      console.log(` OTP Entered: ${otp}`);
      await this.otpLocator.fill(otp);   // Fill OTP
      await this.clickVerifyButton();  // Click Verify

      // Wait for Success OR Error
      const result = await Promise.race
      ([
        this.page.waitForURL(this.homeUrlPattern,{ timeout: 20000 }).then(() => 'success').catch(() => null),
        this.errorLocator.waitFor({state: 'visible', timeout: 20000}).then(() => 'error').catch(() => null)
      ]);

      // LOGIN SUCCESS
      if (result === 'success')
      {
        console.log(`Login successful: ${this.page.url()}`);
        return;
      }

      // INVALID OTP
      if (result === 'error')
      {
        const msg = (await this.errorLocator.textContent().catch(() => 'Invalid OTP')).trim();
        console.log(` Invalid OTP: ${msg}`);
        // Clear OTP field
        try
        {
          await this.otpLocator.fill('');
          console.log('OTP cleared. Please re-enter OTP.');
        }
        catch
        {
          console.log('Unable to clear OTP field.');
        }
        continue;
      }

      // Fallback URL Check
      if (this.homeUrlPattern.test(this.page.url()))
      {
        console.log(`Login successful (fallback): ${this.page.url()}`);
        return;
      }
      await this.page.waitForTimeout(2000);
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