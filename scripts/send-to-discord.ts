import * as fs from 'fs';
import fetch from 'node-fetch';
import FormData from 'form-data';

const screenshotPath = fs.readFileSync('screenshot_path.txt', 'utf-8');

const today = new Date().toISOString().split('T')[0];

const webhook = process.env.DISCORD_WEBHOOK_URL;

const form = new FormData();
form.append('file', fs.createReadStream(screenshotPath));
form.append('content', `📸 Screenshot for **${today}**`);

fetch(webhook!, {
  method: 'POST',
  body: form as any,
}).then(res => {
  console.log('✅ Discord:', res.statusText);
}).catch(console.error);
