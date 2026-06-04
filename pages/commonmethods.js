import { expect } from '@playwright/test';
import commonLocators from '../pageobjects/commonLocators.js';
import BasePage from './base.page.js';
import readline from 'readline';

class CommonMethods extends BasePage
{
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


    async printBrowserDetails(mode = 'Unknown') 
        {
            const page = this.page;
            console.log(`\n🧪 ===== Browser Details (${mode}) =====`);
            // Playwright viewport
            const viewport = page.viewportSize();
            console.log('🖥️ Playwright Viewport:', viewport || 'null (uses window size)');
            //Browser window + zoom
            const browserDetails = await page.evaluate(() => 
            {
                return {
                    innerWidth: window.innerWidth,
                    innerHeight: window.innerHeight,
                    outerWidth: window.outerWidth,
                    outerHeight: window.outerHeight,
                    devicePixelRatio: window.devicePixelRatio,
                    zoom: document.body.style.zoom || '100%'
                };
            });
            console.log('🌐 Browser Size + Zoom:', browserDetails);
            console.log('=====================================\n');
        }

    async setZoom(zoomPercent = 100) 
    {
        await this.page.evaluate((zoom) => 
        {
        document.body.style.zoom = zoom + '%';
        }, zoomPercent);
    }

     async navigationTab(tabName) 
    {
            const page = this.page;
            console.log(`🔍 Navigating to: ${tabName}`);
            const navBar = page.locator('nav[aria-label="Global"]');
            await navBar.waitFor({ state: 'visible' });
            await page.waitForTimeout(1500);
            const navLinks = navBar.locator('a:visible');
            const count = await navLinks.count();
            console.log(`Total visible nav items: ${count}`);
            for (let i = 0; i < count; i++) 
            {
                let text = await navLinks.nth(i).innerText();
                text = text?.trim().toLowerCase();
                if (!text) continue;
                console.log(`Nav Item ${i + 1}: ${text}`);
                if (text === tabName.toLowerCase()) {
                    console.log(`✅ Found ${tabName} → Clicking`);
                    await navLinks.nth(i).click();
                    return;
                }
            }
            console.log(`⚠️ ${tabName} not visible. Checking inside 'More' menu`);
            const moreBtn = page.getByRole('button', { name: /more/i });
            if (await moreBtn.isVisible()) 
                {
                    await moreBtn.click();
                    const moreItems = page.locator('one-app-nav-bar-item-root a:visible');
                    await moreItems.first().waitFor({ state: 'visible' });
                    const moreCount = await moreItems.count();
                    console.log(`📊 Total items inside More: ${moreCount}`);
                    for (let i = 0; i < moreCount; i++) 
                    {
                    let text = await moreItems.nth(i).innerText();
                    text = text?.trim().toLowerCase();
                    if (!text) continue;
                    console.log(`More Item ${i + 1}: ${text}`);
                    if (text === tabName.toLowerCase()) {
                        console.log(`✅ Found ${tabName} in More → Clicking`);
                        await moreItems.nth(i).click();
                        return;
                    }
                }
            } else {
                console.log(`❌ 'More' button not visible`);
            }
            // ❌ Final fail
            throw new Error(`❌ Tab "${tabName}" not found in navigation bar`);
        }
    
    async HeaderActions(value) 
        {
            const page = this.page;
            console.log(`\n🔍 Searching Header Action: ${value}`);
            const header = page.locator('div.slds-page-header').first();
            await header.waitFor({ state: 'visible' });
            const items = header.locator('button, a, [title], [aria-label]');
            const count = await items.count();
            console.log(`📊 Total header items: ${count}`);
            for (let i = 0; i < count; i++) 
            {
                const el = items.nth(i);
                let text =
                    await el.innerText() ||
                    await el.getAttribute('title') ||
                    await el.getAttribute('aria-label');
                text = text?.trim();
                if (!text) continue;
                console.log(`Item ${i + 1}: ${text}`);
                if (text.toLowerCase().includes(value.toLowerCase())) 
                {
                    console.log(`✅ Clicking: ${text}`);
                    await el.click();
                    return;
                }
            }
            throw new Error(`❌ "${value}" not found in header`);
        }

        async getOtpFromConsole(timeout = 60000) 
        {
            console.log('🔐 Waiting for OTP input from console...');
            const rl = readline.createInterface({input: process.stdin,output: process.stdout});
            const otpPromise = new Promise((resolve) => 
                {
                  rl.question('👉 Enter OTP: ', (otp) => 
                    {
                        rl.close();
                        resolve(otp.trim());
                        });
                });
            const timeoutPromise = new Promise((_, reject) =>setTimeout(() => reject(new Error('⏰ OTP input timeout')), timeout));
            return Promise.race([otpPromise, timeoutPromise]);
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

    async enterAndSelectFromValueDropDown(placeholderClick,dropdownOptions,valueToSelect)
    {
      await this.waitAndType(placeholderClick,String(valueToSelect));
      const option = this.page.locator(dropdownOptions);
      await option.first().click();
    }

    async clickStandardButton(objectName, buttonName) 
    {
        const locator = `//li[contains(@data-target-selection-name,"${objectName}.${buttonName}")]//button`;
        await this.page.locator(locator).waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);
        await this.page.locator(locator).click();
        //await this.clickStandardButton('Opportunity', 'SaveEdit');
        //await this.clickStandardButton('Opportunity', 'SaveAndNew');
        //await this.clickStandardButton('Opportunity', 'CancelEdit');
    }
}
export default CommonMethods;