import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendBookingConfirmation = async (booking) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('⚠️ Email credentials not found in .env. Skipping email confirmation.');
        return { success: false, message: 'Credentials missing' };
    }

    const { name, email, topic, date, time, birthDate, birthTime, birthPlace, phone } = booking;

    // Premium HTML Template
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmed - Astro Pravin</title>
        <style>
            body { margin: 0; padding: 0; background-color: #0F172A; font-family: 'Georgia', serif; }
            .container { max-width: 600px; margin: 0 auto; background-color: #0F172A; }
            .card { background-color: #ffffff; border-radius: 16px; overflow: hidden; margin: 40px 20px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
            .header { background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); height: 120px; position: relative; display: flex; align-items: center; justify-content: center; }
            .icon-circle { width: 80px; height: 80px; background-color: #ffffff; border-radius: 50%; position: absolute; bottom: -40px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1); font-size: 40px; }
            .content { padding: 60px 40px 40px 40px; text-align: center; }
            .title { color: #1E293B; font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .subtitle { color: #64748B; font-size: 16px; margin-bottom: 30px; line-height: 1.5; font-family: sans-serif; }
            .details-box { background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px; margin-bottom: 30px; text-align: left; }
            .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-family: sans-serif; font-size: 14px; }
            .detail-label { color: #64748B; }
            .detail-value { color: #1E293B; font-weight: 600; text-align: right; }
            .btn { display: inline-block; background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #0F172A; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-weight: bold; font-family: sans-serif; font-size: 16px; letter-spacing: 0.5px; margin-top: 10px; }
            .footer { text-align: center; color: #94A3B8; font-size: 12px; font-family: sans-serif; padding-bottom: 40px; }
            .divider { border-top: 1px solid #E2E8F0; margin: 15px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="card">
                <div class="header">
                    <!-- Optional: Add Logo Image here if available -->
                    <div class="icon-circle">✨</div>
                </div>
                <div class="content">
                    <h1 class="title">Booking Confirmed!</h1>
                    <p class="subtitle">
                        Namaste <strong>${name}</strong>,<br>
                        Your consultation with Acharya Pravin is securely booked. The stars are aligning for you.
                    </p>

                    <div class="details-box">
                        <div class="detail-row">
                            <span class="detail-label">Service Type</span>
                            <span class="detail-value">${topic}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Date & Time</span>
                            <span class="detail-value">${date || 'Not specified'} ${time ? 'at ' + time : ''}</span>
                        </div>
                        <div class="divider"></div>
                        <div class="detail-row">
                            <span class="detail-label">Mobile</span>
                            <span class="detail-value">${phone}</span>
                        </div>
                        ${birthDate ? `
                        <div class="detail-row">
                            <span class="detail-label">Birth Date</span>
                            <span class="detail-value">${birthDate}</span>
                        </div>
                        ` : ''}
                         ${birthPlace ? `
                        <div class="detail-row">
                            <span class="detail-label">Birth Place</span>
                            <span class="detail-value">${birthPlace}</span>
                        </div>
                        ` : ''}
                    </div>

                    <a href="https://astropravin.com" class="btn">Visit Website</a>
                </div>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Astro Pravin. All rights reserved.</p>
                <p>May the cosmic energy guide you.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        const info = await transporter.sendMail({
            from: `"Astro Pravin" <${process.env.EMAIL_USER}>`,
            to: email || process.env.EMAIL_USER, // Send to user if email exists, else send to admin (self) as fallback/notification
            subject: `✨ Booking Confirmed: ${topic} - ${name}`,
            html: htmlContent
        });

        console.log('✅ Email sent: %s', info.messageId);

        // Also send a notification to the Admin (Self) if the user email was different
        if (email && email !== process.env.EMAIL_USER) {
            await transporter.sendMail({
                from: `"System Notifier" <${process.env.EMAIL_USER}>`,
                to: process.env.EMAIL_USER,
                subject: `New Booking Alert: ${name}`,
                html: `<p>New booking received for <strong>${topic}</strong> by <strong>${name}</strong> (${phone}). Check dashboard for details.</p>`
            });
        }

        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Email Send Error:', error);
        return { success: false, error: error.message };
    }
};
