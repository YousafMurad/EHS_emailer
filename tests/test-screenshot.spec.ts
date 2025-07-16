import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('Take Daily Fee Report screenshot and save', async ({ page }) => {
  const now = new Date();

  // Format date as YYYY-MM-DD
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const todayDate = `${yyyy}-${mm}-${dd}`; // 👈 strictly this format

  // Format timestamp for screenshot file name (no colons)
  const timestamp = now.toISOString().replace(/[:]/g, '-').split('.')[0];
  const screenshotDir = path.join('screenshots');
  const screenshotName = `screenshot-${timestamp}.png`;
  const screenshotPath = path.join(screenshotDir, screenshotName);

  // Ensure screenshots folder exists
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir);
  }

  // Go to EHS login page
  await page.goto('https://fsd.ehs.edu.pk/');

  // Fill login credentials
  await page.getByRole('textbox', { name: 'User Name' }).fill(process.env.LOGIN_USERNAME || '');
  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.LOGIN_PASSWORD || '');

  // Select session and login
  await page.locator('#MainContent_ddlSession').selectOption('12');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForLoadState('networkidle');

  // Navigate to Daily Fee Report
  await page.getByRole('link', { name: '   Reports' }).click();
  await page.getByRole('link', { name: 'Daily Fee Report' }).click();

  // Fill today's date in format YYYY-MM-DD
  await page.locator('#MainContent_DateTextBox').fill(todayDate);
  await page.getByRole('heading', { name: 'Select Date Generate Report' }).locator('a').click();
  await page.locator('#MainContent_ddlUsers_chosen').getByText('Shahid Ikram').click();

  // Generate the report
  await page.getByRole('button', { name: 'Generate Report' }).click();

  // Wait for the report viewer to appear
  await page.waitForSelector('#MainContent_ReportViewer1_ctl10_ctl03_ctl00', {
    timeout: 10000,
  });

  // Take full-page screenshot
  await page.screenshot({ path: screenshotPath, fullPage: true });

  // Save screenshot path for other scripts
  fs.writeFileSync('screenshot_path.txt', screenshotPath);
  console.log(`✅ Screenshot saved at: ${screenshotPath}`);
});
