import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  } : undefined,
});

export async function sendMedicationReminder(
  email: string,
  medicationName: string,
  dosage: string,
  scheduledTime: Date
) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('Email credentials not configured, skipping email');
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@medicationtracker.com',
      to: email,
      subject: `Medication Reminder: ${medicationName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Medication Reminder</h2>
          <p>This is a reminder to take your medication:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Medication:</strong> ${medicationName}</p>
            <p><strong>Dosage:</strong> ${dosage}</p>
            <p><strong>Scheduled Time:</strong> ${scheduledTime.toLocaleString()}</p>
          </div>
          <p>Please remember to mark it as taken in your medication tracker.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}
