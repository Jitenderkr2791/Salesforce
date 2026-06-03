import { expect } from '@playwright/test';
import commonLocators from '../pageobjects/commonLocators';

class BasePage 
{
    constructor(page)
    {
      this.page = page;
    }

    /** ---------- Navigation ---------- **/
    async open(url) {
        await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    }

    async getTitle() {
        return this.page.title();
    }

    async getUrl() {
        return this.page.url();
    }

    async pause() {
        await this.page.pause();
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('domcontentloaded');
    }

    async wait(milliseconds = 3000) {
        await this.page.waitForTimeout(milliseconds);
    }

     async waitForPageStable() {
        await this.page.waitForLoadState('domcontentloaded');

        const spinner = this.page.locator('.slds-spinner');

        if (await spinner.count() > 0) {
            await spinner.first().waitFor({ state: 'hidden', timeout: 10000 });
        }

        await this.page.waitForTimeout(300);
    }

    /** ---------- Clicks & Typing ---------- **/

   async waitAndClick(selectorOrLocator) 
   {
        await this.waitForPageStable();
         let element = typeof selectorOrLocator === 'string'?this.page.locator(selectorOrLocator):selectorOrLocator;
        if (this.page.isClosed())
             {
               throw new Error('Page was closed before click');
             }
    await element.first().waitFor({ state: 'visible', timeout: 30000 });
    await element.first().click();
   }

    async waitAndHardClick(selector) {
        const element = await this.page.$(selector);
        if (element) {
            await element.click();
        } else {
            throw new Error(`Element not found: ${selector}`);
        }
    }

    async waitAndFill(selector, text) 
    {
        await this.waitForPageStable();
        const element = this.page.locator(selector);
        await element.waitFor({ state: 'visible', timeout: 30000 });
        await element.scrollIntoViewIfNeeded();
        await element.click();
        await element.fill(text);
        console.log(`Entered value: ${text}`);
    }

    async waitAndType(selector, text) 
    {
        await this.waitAndFill(selector, text);
    }

    async keyPress(selector, key) 
    {
        await this.page.locator(selector).press(key);
    }

    /** ---------- Dropdown ---------- **/
   static async enterTextAndSelectValueFromDropdown(page, inputSelector, value, optionSelector) 
    {
        const input = page.locator(inputSelector);
        await input.click();
        await input.fill(value);
        const options = page.locator(optionSelector);
        await options.first().waitFor({ state: 'visible', timeout: 15000 });
        const count = await options.count();
        console.log("Available dropdown options:");

        for (let i = 0; i < count; i++) 
         {
            const option = options.nth(i);
            let optionText = await option.getAttribute('title');
            if (!optionText) {
                optionText = (await option.textContent())?.trim();
                }
            console.log(` ${i + 1}. ${optionText}`);
            if (optionText && optionText.toLowerCase().includes(value.toLowerCase())) 
                {
                    console.log(`Match found: "${optionText}" → Clicking`);
                    await option.click();
                    return;
                }
         }
    throw new Error(`Value "${value}" not found in dropdown`);
    }

    async selectValueFromDropdown(inputSelector, optionSelector, value) 
    {
        
        const input = this.page.locator(inputSelector);      // 1. Click dropdown
        await input.waitFor({ state: 'visible', timeout: 15000 });   
        await input.click();
        console.log(`Clicked dropdown: ${inputSelector}`);
        
        const options = this.page.locator(`${optionSelector}:visible`);  // 2. Locate options dynamically

        await options.first().waitFor({ state: 'visible', timeout: 15000 });

        const count = await options.count();
        console.log(`Total options found: ${count}`);

        for (let i = 0; i < count; i++)      // 3. Loop through options
        {
            const option = options.nth(i);
            let text = await option.locator('[title]').getAttribute('title');
            if (!text) 
                {
                text = (await option.textContent())?.trim();
                }
            console.log(`Option ${i + 1}: ${text}`);
           
            if (text && text.toLowerCase() === value.toLowerCase())      // 4. Match & click
                {
                    console.log(`Selected: ${text}`);
                    await option.scrollIntoViewIfNeeded();
                    await option.click();
                    return;
                }
        }
    throw new Error(`Value "${value}" not found in dropdown`);
    }

    /** ---------- Verifications ---------- **/
    async verifyElementText(selector, expectedText) 
    {
        const textValue = await this.page.textContent(selector);
        expect(textValue?.trim()).toBe(expectedText);
    }

    async verifyElementContainsText(selector, expectedText) 
    {
        const locator = this.page.locator(selector);
        await expect(locator).toContainText(expectedText);
    }

    async verifyJSElementValue(selector, expectedValue) 
    {
        const value = await this.page.$eval(selector, el => el.value);
        expect(value?.trim()).toBe(expectedValue);
    }

    async verifyElementAttribute(selector, attribute, expectedValue) 
    {
        const attrValue = await this.page.getAttribute(selector, attribute);
        expect(attrValue?.trim()).toBe(expectedValue);
    }

    /** ---------- Element State Checks ---------- **/

    async isElementVisible(selector, errorMessage = 'Element not visible') {
        const element = this.page.locator(selector);
        const isVisible = await element.isVisible();
        if (!isVisible) throw new Error(errorMessage);
        expect(isVisible).toBeTruthy();
    }

    async isElementNotVisible(selector) {
        await expect(this.page.locator(selector)).toBeHidden();
    }

    async isElementEnabled(selector, errorMessage = 'Element not enabled') {
        const element = this.page.locator(selector);
        const isEnabled = await element.isEnabled();
        if (!isEnabled) throw new Error(errorMessage);
        expect(isEnabled).toBeTruthy();
    }

    async isElementChecked(selector, errorMessage = 'Checkbox not checked') {
        const element = this.page.locator(selector);
        const isChecked = await element.isChecked();
        if (!isChecked) throw new Error(errorMessage);
        expect(isChecked).toBeTruthy();
    }

    /** ---------- Lists / Collections ---------- **/

    async getFirstElementFromTheList(selector) {
        const rows = this.page.locator(selector);
        const count = await rows.count();
        if (count === 0) throw new Error('No elements found');
        return (await rows.nth(0).textContent())?.trim();
    }

    async getLastElementFromTheList(selector) {
        const rows = this.page.locator(selector);
        const count = await rows.count();
        if (count === 0) throw new Error('No elements found');
        return (await rows.nth(count - 1).textContent())?.trim();
    }

    async clickAllElements(selector) {
        const rows = this.page.locator(selector);
        const count = await rows.count();
        for (let i = 0; i < count; i++) {
            await rows.nth(i).click();
        }
    }

    async clickAllLinksInNewTabs(selector) {
        const rows = this.page.locator(selector);
        const count = await rows.count();
        for (let i = 0; i < count; i++) {
            await rows.nth(i).click({ modifiers: ['Control', 'Shift'] });
        }
    }

    /** ---------- Utility ---------- **/

    async takeScreenShot(name = 'screenshot.png') {
        await this.page.screenshot({ path: name, fullPage: true });
        console.log(`📸 Screenshot saved as: ${name}`);
    }

    async verifyToastMessage(entityName, recordName)
     {
            const toastLocator = await this.page.locator(commonLocators.toastMessage);
            await toastLocator.waitFor({ state: 'visible' });
            const actualMessage = await toastLocator.textContent();
            const trimmedMessage = actualMessage.trim();
            console.log(" Actual Toast Message:", trimmedMessage);
            const regex = new RegExp(`${entityName}\\s+"${recordName}"\\s+was created\\.?`);
                if (!regex.test(trimmedMessage))
                {
                    throw new Error(` Toast message mismatch! Expected pattern: ${entityName} "${recordName}" was created  Actual: ${trimmedMessage}`);
                }
                console.log(" Toast verified:", trimmedMessage);
     }
    
    async closeToastMessage()
        {
            console.log(" Closing toast message...");
            const toast = this.page.locator(commonLocators.toastMessage);
            const closeBtn = this.page.locator(commonLocators.toastCloseButton);
            if (await closeBtn.isVisible())
            {
                await closeBtn.click();
                console.log(" Close button clicked");
                await expect(toast).toBeHidden({ timeout: 10000 });       // Wait until toast disappears (max 10 sec)
                console.log(" Toast closed successfully");
            }
            else
            {
                console.log(" Toast close button not visible");
            }
        }
    async clickNewButton()  
    {
      await this.waitAndClick(commonLocators.newButton);
    }
    
    

}

export default BasePage;