import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig
({
      testDir: './tests',
      fullyParallel: true,                            /* Run tests in files in parallel */
      forbidOnly: !!process.env.CI,                   /* Fail the build on CI if you accidentally left test.only in the source code. */
      retries: process.env.CI ? 2 : 0,                /* Retry on CI only */
      workers: process.env.CI ? 1 : undefined,       /* Opt out of parallel tests on CI. */
     
      reporter:[ ['html'],['junit', { outputFile: 'results.xml' }], ['allure-playwright'] ],       /* Reporter to use. See https://playwright.dev/docs/test-reporters */
                                                                
      /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
      use: {
        browserName: 'chromium',

         headless: process.env.CI ? true : process.env.HEADLESS === 'true',     //  CONTROL FROM ENV //$env:HEADLESS="true"; npx playwright test
         viewport: process.env.CI ? { width: 1920, height: 1080 }: process.env.HEADLESS === 'true'? { width: 1920, height: 1080 }: null,
      // ✅ MAXIMIZE IN HEADED, FIX SIZE IN HEADLESS
         launchOptions: { args: ['--start-maximized']},  // Start browser maximized (works in headed mode, safe to keep in headless)

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',
        slowMo: 100,                   // Slow down actions by 100ms to better observe test execution
        screenshot: 'only-on-failure',      // Capture screenshots only on test failures
        video: 'retain-on-failure', 
          }, // Record video only for failed tests},
      

  /* Configure projects for major browsers */
    projects:
    [
          {
            name: 'chrome',
            use: {
              browserName: 'chromium'
            },
          },
 
    
        //{
        //  name: 'firefox',
        //  use: { ...devices['Desktop Firefox'] },
       // },

       // {
       //   name: 'webkit',
       //   use: { ...devices['Desktop Safari'] },
       // },
        
       // Test against mobile viewports. 
        // {
        //   name: 'Mobile Chrome',
        //   use: { ...devices['Pixel 5'] },
        // },
        // {
        //   name: 'Mobile Safari',
        //   use: { ...devices['iPhone 12'] },
        // },

        /* Test against branded browsers. */
        // {
        //   name: 'Microsoft Edge',
        //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
        // },
        // {
        //   name: 'Google Chrome',
        //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
        // },
      ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});