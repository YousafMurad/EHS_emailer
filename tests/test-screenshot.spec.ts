import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('Take screenshot of Daily Fee Report', async ({ page }) => {
  const today = new Date();
  const timestamp = today.toISOString().replace(/[:]/g, '-').split('.')[0];
  const screenshotName = `screenshot-${timestamp}.png`;
  const screenshotPath = path.join('screenshots', screenshotName);

  await page.goto('https://fsd.ehs.edu.pk/');
  await page.getByRole('textbox', { name: 'User Name' }).fill('madam');
  await page.getByRole('textbox', { name: 'Password' }).fill('madam123@');
  await page.locator('#MainContent_ddlSession').selectOption('12');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForLoadState('networkidle');

  await page.getByRole('link', { name: '   Reports' }).click();
  await page.getByRole('link', { name: 'Daily Fee Report' }).click();

  const dateString = today.toISOString().split('T')[0];
  await page.locator('#MainContent_DateTextBox').fill(dateString);
  await page.getByRole('heading', { name: 'Select Date Generate Report' }).locator('a').click();
  await page.locator('#MainContent_ddlUsers_chosen').getByText('Shahid Ikram').click();
  await page.getByRole('button', { name: 'Generate Report' }).click();

  // await page.waitForSelector('#MainContent_ReportViewer1_ctl10_ctl03_ctl00');


  await page.waitForTimeout(5000);
  
  // Wait for report to load
  await page.screenshot({ path: screenshotPath, fullPage: true });

  // Save path to file so other scripts can read it
  fs.writeFileSync('screenshot_path.txt', screenshotPath);
  console.log(`✅ Screenshot saved at ${screenshotPath}`);
});
