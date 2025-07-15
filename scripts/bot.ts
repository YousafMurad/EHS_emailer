import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const today = new Date().toISOString().split('T')[0];
  const screenshotPath = `screenshot-${today}.png`;

  // Go to EHS login page
  await page.goto('https://fsd.ehs.edu.pk/');

  // Fill login details from environment variables
  await page.getByRole('textbox', { name: 'User Name' }).fill(process.env.LOGIN_USERNAME || '');
  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.LOGIN_PASSWORD || '');

  // Select session and login
  await page.locator('#MainContent_ddlSession').selectOption('12');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForLoadState('networkidle');

  // Navigate to Daily Fee Report
  await page.getByRole('link', { name: '   Reports' }).click();
  await page.getByRole('link', { name: 'Daily Fee Report' }).click();

  // Set today's date
  await page.locator('#MainContent_DateTextBox').fill(today);
  await page.getByRole('heading', { name: 'Select Date Generate Report' }).locator('a').click();

  // Select user (e.g. Shahid Ikram)
  await page.locator('#MainContent_ddlUsers_chosen').getByText('Shahid Ikram').click();

  // Click "Generate Report"
  await page.getByRole('button', { name: 'Generate Report' }).click();

  // ✅ Wait for report viewer or specific element to appear before screenshot
  await page.waitForSelector('#MainContent_ReportViewer1_ctl10_ctl03_ctl00', {
    timeout: 10000,
  });

  // 📸 Take full page screenshot
  await page.screenshot({ path: screenshotPath, fullPage: true });

  // Save screenshot path for use in email/discord scripts
  fs.writeFileSync('screenshot_path.txt', screenshotPath);
  console.log(`✅ Screenshot saved as ${screenshotPath}`);

  await browser.close();
})();
