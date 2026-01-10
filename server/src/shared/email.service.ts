import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
    private transporter;

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.configService.get<string>('EMAIL_USER'),
                pass: this.configService.get<string>('EMAIL_PASS'),
            },
        });
    }

    async sendBookingConfirmation(booking: any) {
        if (!this.transporter) return;

        const mailOptions = {
            from: this.configService.get<string>('EMAIL_USER'),
            to: booking.email,
            subject: 'Booking Confirmation - Astro Pravin',
            html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #D97706;">Booking Confirmed!</h2>
                <p>Namaste <strong>${booking.name}</strong>,</p>
                <p>Your booking request has been received successfully.</p>
                <hr />
                <p><strong>Topic:</strong> ${booking.topic}</p>
                <p><strong>Date:</strong> ${booking.date} at ${booking.time}</p>
                <p><strong>Status:</strong> ${booking.status}</p>
                <hr />
                <p>We will contact you shortly via phone/WhatsApp at ${booking.phone}.</p>
                <p><em>|| Shri Swami Samarth ||</em></p>
            </div>
        `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`📧 Email sent to ${booking.email}`);
        } catch (error) {
            console.error('❌ Email failed:', error);
        }
    }
}
