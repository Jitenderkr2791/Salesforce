import { expect } from '@playwright/test';

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

     async waitAndClick(selector) 
        {
        const element = this.page.locator(selector);
        await this.page.waitForLoadState('domcontentloaded');
      //  await element.waitFor({ state: 'attached', timeout: 30000 });
        await expect(element).toBeEnabled({ timeout: 30000 });
        await element.click();
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
}
export default BasePage;