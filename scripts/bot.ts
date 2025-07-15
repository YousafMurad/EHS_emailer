import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const today = new Date().toISOString().split('T')[0];
  const screenshotPath = `screenshot-${today}.png`;

  await page.goto('https://fsd.ehs.edu.pk/');

  await page.getByRole('textbox', { name: 'User Name' }).fill(process.env.LOGIN_USERNAME || '');
  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.LOGIN_PASSWORD || '');

  await page.locator('#MainContent_ddlSession').selectOption('12');

  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForLoadState('networkidle');

  await page.getByRole('link', { name: '   Reports' }).click();
  await page.getByRole('link', { name: 'Daily Fee Report' }).click();

  await page.locator('#MainContent_DateTextBox').fill(today);
  await page.getByRole('heading', { name: 'Select Date Generate Report' }).locator('a').click();

  await page.locator('#MainContent_ddlUsers_chosen').getByText('Shahid Ikram').click();

  await page.getByRole('button', { name: 'Generate Report' }).click();
  await page.waitForLoadState('networkidle');

  await page.screenshot({ path: screenshotPath, fullPage: true });

  fs.writeFileSync('screenshot_path.txt', screenshotPath);
  console.log(`✅ Screenshot saved as ${screenshotPath}`);

  await browser.close();
})();
