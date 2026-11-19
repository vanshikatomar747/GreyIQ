import nodemailer from 'nodemailer';

export const sendContactNotification = async ({ name, email, message }) => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const toEmail = process.env.CONTACT_EMAIL || 'greyiqts@gmail.com';

  // Check if SMTP configuration is fully provided
  if (host && user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port: parseInt(port, 10),
        secure: parseInt(port, 10) === 463 || parseInt(port, 10) === 465, // true for 465, false for other ports
        auth: {
          user,
          pass,
        },
      });

      const mailOptions = {
        from: `"GreyIQ Portal" <${user}>`,
        to: toEmail,
        replyTo: email,
        subject: `[GreyIQ] New Support Message from ${name}`,
        text: `You have received a new contact submission on GreyIQ:\n\n` +
              `Name: ${name}\n` +
              `Email: ${email}\n\n` +
              `Message:\n${message}\n\n` +
              `---`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #2563EB; border-bottom: 1px solid #ddd; padding-bottom: 10px;">New Support Message</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <div style="background-color: #f9f9f9; border-left: 4px solid #2563EB; padding: 15px; margin-top: 15px; border-radius: 4px;">
              <p style="margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
            <p style="font-size: 11px; color: #888; margin-top: 25px; border-top: 1px solid #eee; padding-top: 10px;">
              This notification was sent automatically from GreyIQ.
            </p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`[Mailer] Contact email successfully sent to ${toEmail}`);
    } catch (error) {
      console.error('[Mailer Error] Failed to send contact email:', error.message);
    }
  } else {
    // Fallback: log to console in dev / if SMTP is not configured
    console.log('\n--- [MAILER MOCK] ---');
    console.log(`To: ${toEmail}`);
    console.log(`Subject: [GreyIQ] New Support Message from ${name}`);
    console.log(`Reply-To: ${email}`);
    console.log('Body:');
    console.log(`  Name: ${name}`);
    console.log(`  Email: ${email}`);
    console.log(`  Message:\n  "${message}"`);
    console.log('---------------------\n');
  }
};
