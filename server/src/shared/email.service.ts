import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
    private transporter;

    constructor(private configService: ConfigService) {
        const user = this.configService.get<string>('EMAIL_USER');
        const pass = this.configService.get<string>('EMAIL_PASS');
        if (user && pass) {
            this.transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: { user, pass },
            });
        }
    }

    private generateIcsCalendarInvite(booking: any): string {
        let startDateTime = new Date();
        let endDateTime = new Date(startDateTime.getTime() + 45 * 60 * 1000);

        const prefDate = booking.preferredDate || booking.date;
        const prefTime = booking.preferredTime || booking.time;

        if (prefDate) {
            const dateParts = String(prefDate).split(/[-/]/);
            let year = 2026, month = 0, day = 1;
            if (dateParts[0]?.length === 4) {
                year = parseInt(dateParts[0], 10);
                month = parseInt(dateParts[1], 10) - 1;
                day = parseInt(dateParts[2], 10);
            } else if (dateParts.length >= 3) {
                day = parseInt(dateParts[0], 10);
                month = parseInt(dateParts[1], 10) - 1;
                year = parseInt(dateParts[2], 10);
            }

            let hours = 10, minutes = 0;
            if (prefTime) {
                const timeMatch = String(prefTime).match(/(\d+):?(\d+)?\s*(AM|PM)?/i);
                if (timeMatch) {
                    let h = parseInt(timeMatch[1], 10);
                    const m = parseInt(timeMatch[2] || '0', 10);
                    const period = (timeMatch[3] || '').toUpperCase();
                    if (period === 'PM' && h < 12) h += 12;
                    if (period === 'AM' && h === 12) h = 0;
                    hours = h;
                    minutes = m;
                }
            }

            if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
                startDateTime = new Date(year, month, day, hours, minutes, 0);
                endDateTime = new Date(startDateTime.getTime() + 45 * 60 * 1000);
            }
        }

        const formatIcs = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, '');
        const now = formatIcs(new Date());
        const start = formatIcs(startDateTime);
        const end = formatIcs(endDateTime);
        const uid = `astropravin_${booking._id || Date.now()}@astropravin.com`;

        return [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//AstroPravin//Vedic Astrology Consultation//EN',
            'CALSCALE:GREGORIAN',
            'METHOD:REQUEST',
            'BEGIN:VEVENT',
            `UID:${uid}`,
            `DTSTAMP:${now}`,
            `DTSTART:${start}`,
            `DTEND:${end}`,
            `SUMMARY:Vedic Jyotish Consultation: ${booking.name} (${booking.topic || 'Astrology'})`,
            `DESCRIPTION:Devotee: ${booking.name}\\nPhone: ${booking.phone || ''}\\nDOB: ${booking.birthDate || ''} at ${booking.birthTime || ''}\\nPlace: ${booking.birthPlace || ''}\\nTopic: ${booking.topic || ''}\\nConsultant: Pandit Pravin Shriram (+91 99216 97908)`,
            'LOCATION:Solapur Kendra / WhatsApp Video Call (+91 99216 97908)',
            'STATUS:CONFIRMED',
            'BEGIN:VALARM',
            'TRIGGER:-PT30M',
            'ACTION:DISPLAY',
            `DESCRIPTION:Reminder: Consultation with ${booking.name} starting in 30 minutes`,
            'END:VALARM',
            'BEGIN:VALARM',
            'TRIGGER:-PT15M',
            'ACTION:DISPLAY',
            `DESCRIPTION:Consultation Starting: ${booking.name} in 15 minutes`,
            'END:VALARM',
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');
    }

    private generateGoogleCalendarUrl(booking: any): string {
        let startDateTime = new Date();
        let endDateTime = new Date(startDateTime.getTime() + 45 * 60 * 1000);

        const prefDate = booking.preferredDate || booking.date;
        const prefTime = booking.preferredTime || booking.time;

        if (prefDate) {
            const dateParts = String(prefDate).split(/[-/]/);
            let year = 2026, month = 0, day = 1;
            if (dateParts[0]?.length === 4) {
                year = parseInt(dateParts[0], 10);
                month = parseInt(dateParts[1], 10) - 1;
                day = parseInt(dateParts[2], 10);
            } else if (dateParts.length >= 3) {
                day = parseInt(dateParts[0], 10);
                month = parseInt(dateParts[1], 10) - 1;
                year = parseInt(dateParts[2], 10);
            }

            let hours = 10, minutes = 0;
            if (prefTime) {
                const timeMatch = String(prefTime).match(/(\d+):?(\d+)?\s*(AM|PM)?/i);
                if (timeMatch) {
                    let h = parseInt(timeMatch[1], 10);
                    const m = parseInt(timeMatch[2] || '0', 10);
                    const period = (timeMatch[3] || '').toUpperCase();
                    if (period === 'PM' && h < 12) h += 12;
                    if (period === 'AM' && h === 12) h = 0;
                    hours = h;
                    minutes = m;
                }
            }

            if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
                startDateTime = new Date(year, month, day, hours, minutes, 0);
                endDateTime = new Date(startDateTime.getTime() + 45 * 60 * 1000);
            }
        }

        const formatIso = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, '');
        const dates = `${formatIso(startDateTime)}/${formatIso(endDateTime)}`;
        const title = `Vedic Jyotish Consultation: ${booking.name} (${booking.topic || 'Consultation'})`;

        const details = [
            `🕉️ AstroPravin Vedic Astrology Consultation`,
            `Client Name: ${booking.name}`,
            `Mobile / WhatsApp: ${booking.phone || ''}`,
            `Consultation Topic: ${booking.topic || ''}`,
            `Date of Birth: ${booking.birthDate || ''}`,
            `Time of Birth: ${booking.birthTime || ''}`,
            `Place of Birth: ${booking.birthPlace || ''}`,
            `Slot: ${prefDate || ''} ${prefTime || ''}`,
            `Consultant: Pandit Pravin Shriram (+91 99216 97908)`,
            `|| Shri Swami Samarth ||`
        ].join('\n');

        const params = new URLSearchParams({
            action: 'TEMPLATE',
            text: title,
            dates: dates,
            details: details,
            location: 'Solapur Kendra / WhatsApp Video Call (+91 99216 97908)',
        });

        return `https://calendar.google.com/calendar/render?${params.toString()}`;
    }

    async sendBookingConfirmation(booking: any) {
        if (!this.transporter) return;

        const adminCalendarEmail = this.configService.get<string>('GOOGLE_CALENDAR_EMAIL') ||
            this.configService.get<string>('EMAIL_USER') ||
            'pravin.shriram@gmail.com';

        const icsContent = this.generateIcsCalendarInvite(booking);
        const gcalUrl = this.generateGoogleCalendarUrl(booking);

        const recipients = [booking.email, adminCalendarEmail].filter(Boolean).join(', ');

        const mailOptions = {
            from: this.configService.get<string>('EMAIL_USER') || 'astropravin@gmail.com',
            to: recipients,
            subject: `🕉️ Booking Confirmed: ${booking.name} - ${booking.topic || 'Vedic Consultation'} [Calendar Invite Attached]`,
            html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #1C1917; max-width: 600px; margin: 0 auto; border: 1px solid #EADCC8; border-radius: 16px; overflow: hidden; background: #FAF8F5;">
                <div style="background: linear-gradient(135deg, #C2410C, #EA580C); padding: 24px; text-align: center; color: #ffffff;">
                    <h1 style="margin: 0; font-size: 22px; font-family: Georgia, serif;">AstroPravin Consultation Confirmed</h1>
                    <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.9;">Jyotish Pravin Shriram • Solapur Kendra</p>
                </div>
                
                <div style="padding: 24px; background: #ffffff;">
                    <p style="font-size: 15px; margin-top: 0;">Namaste <strong>${booking.name}</strong>,</p>
                    <p style="color: #44403C; font-size: 13px; line-height: 1.6;">
                        Your appointment has been registered with Pandit Pravin Shriram's Kendra. An automatic Google Calendar invite has been created and attached below.
                    </p>
                    
                    <div style="background: #FFF7ED; border: 1px solid #FED7AA; border-radius: 12px; padding: 16px; margin: 18px 0; font-size: 13px;">
                        <p style="margin: 4px 0;"><strong>🕉️ Consultation Topic:</strong> ${booking.topic || 'Vedic Astrology'}</p>
                        <p style="margin: 4px 0;"><strong>📅 Preferred Date & Time:</strong> ${booking.preferredDate || booking.date || 'To be confirmed'} at ${booking.preferredTime || booking.time || 'Confirmed Slot'}</p>
                        <p style="margin: 4px 0;"><strong>📞 WhatsApp / Mobile:</strong> ${booking.phone}</p>
                        <p style="margin: 4px 0;"><strong>📍 Kundli Birth Details:</strong> ${booking.birthDate || 'N/A'} • ${booking.birthTime || 'N/A'} • ${booking.birthPlace || 'N/A'}</p>
                    </div>

                    <div style="text-align: center; margin: 24px 0 16px 0;">
                        <a href="${gcalUrl}" target="_blank" style="background: #C2410C; color: #ffffff; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 13px; display: inline-block; box-shadow: 0 4px 12px rgba(194, 65, 12, 0.25);">
                            📅 Add to Google Calendar & Set Alarms
                        </a>
                    </div>
                </div>

                <div style="background: #F5F0E8; padding: 14px 20px; text-align: center; font-size: 11px; color: #78716C; border-top: 1px solid #EADCC8;">
                    <p style="margin: 0;">Solapur Kendra: Shop no.2,3, S.S Icon shopping complex, Gharkul road, Solapur - 413006 | Helpline: +91 99216 97908</p>
                    <p style="margin: 4px 0 0 0; font-weight: bold; color: #C2410C;">|| Shri Swami Samarth ||</p>
                </div>
            </div>
            `,
            icalEvent: {
                filename: 'consultation_invite.ics',
                method: 'request',
                content: icsContent,
            },
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`📧 Calendar-enabled booking confirmation sent to ${recipients}`);
        } catch (error) {
            console.error('❌ Email notification failed:', error);
        }
    }
}
