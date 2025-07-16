import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const today = new Date().toISOString().split('T')[0];
const screenshotPath = fs.readFileSync('screenshot_path.txt', 'utf-8');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const mailOptions = {
  from: process.env.EMAIL_SENDER,
  to: process.env.EMAIL_RECEIVER,
  subject: `📸 Daily Screenshot - ${today}`,
  text: `Attached is the screenshot for ${today}.`,
  attachments: [
    {
      filename: `screenshot-${today}.png`,
      path: screenshotPath,
    },
  ],
};

transporter.sendMail(mailOptions)
  .then(info => console.log('✅ Email sent:', info.response))
  .catch(error => console.error('❌ Email error:', error));
