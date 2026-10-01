import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { EmailService } from '../shared/email.service';

const INITIAL_BOOKINGS = [
    {
        name: "Rahul Deshmukh",
        phone: "+91 98234 56789",
        email: "rahul.deshmukh94@gmail.com",
        birthDate: "14/08/1994",
        birthTime: "06:45 AM",
        birthPlace: "Solapur, Maharashtra",
        topic: "Love & Marriage (Kundli Milan)",
        astrologer: "Pandit Pravin Shriram",
        gender: "Male",
        preferredDate: "2024-05-10",
        preferredTime: "10:30 AM",
        status: "Completed",
        notes: "36 Guna Milan verified. Nadi Dosha cancellation remedies given.",
        createdAt: new Date("2024-05-09T08:30:00Z")
    },
    {
        name: "Priyanka Kulkarni",
        phone: "+91 94220 12345",
        email: "priyanka.kulkarni@yahoo.com",
        birthDate: "22/11/1996",
        birthTime: "02:15 PM",
        birthPlace: "Pune, Maharashtra",
        topic: "Career & Wealth (Promotion & Job Switch)",
        astrologer: "Pandit Pravin Shriram",
        gender: "Female",
        preferredDate: "2024-05-12",
        preferredTime: "04:00 PM",
        status: "Pending",
        notes: "Mahadasha transition analysis requested.",
        createdAt: new Date("2024-05-11T11:20:00Z")
    },
    {
        name: "Amitabh Joshi",
        phone: "+91 98812 34567",
        email: "amitabh.joshi@techcorp.in",
        birthDate: "05/03/1988",
        birthTime: "09:10 AM",
        birthPlace: "Mumbai, Maharashtra",
        topic: "Vastu Shastra Consultation (Office Layout)",
        astrologer: "Pandit Pravin Shriram",
        gender: "Male",
        preferredDate: "2024-05-08",
        preferredTime: "11:00 AM",
        status: "Completed",
        notes: "North-East Ishanya zone energized with Siddh Shree Yantra.",
        createdAt: new Date("2024-05-07T14:45:00Z")
    },
    {
        name: "Snehal Patil",
        phone: "+91 97654 89012",
        email: "snehal.patil97@gmail.com",
        birthDate: "19/07/1997",
        birthTime: "11:30 PM",
        birthPlace: "Kolhapur, Maharashtra",
        topic: "Love & Marriage (Kundli Milan)",
        astrologer: "Pandit Pravin Shriram",
        gender: "Female",
        preferredDate: "2024-05-14",
        preferredTime: "05:30 PM",
        status: "Pending",
        notes: "Navamsha D9 chart check required.",
        createdAt: new Date("2024-05-13T09:15:00Z")
    },
    {
        name: "Sachin Shinde",
        phone: "+91 99223 45678",
        email: "sachin.shinde@shindeenterprises.com",
        birthDate: "03/10/1991",
        birthTime: "07:20 AM",
        birthPlace: "Solapur, Maharashtra",
        topic: "Health & Dosha Remedies (Sade Sati)",
        astrologer: "Pandit Pravin Shriram",
        gender: "Male",
        preferredDate: "2024-05-02",
        preferredTime: "02:00 PM",
        status: "Completed",
        notes: "Shani Tailabhishekam & Blue Sapphire guidance completed.",
        createdAt: new Date("2024-05-01T16:00:00Z")
    },
    {
        name: "Ananya Kadam",
        phone: "+91 98901 23456",
        email: "ananya.kadam@rediffmail.com",
        birthDate: "28/01/1999",
        birthTime: "04:50 PM",
        birthPlace: "Navi Mumbai, Maharashtra",
        topic: "Life Analysis (Complete Kundli Patrika)",
        astrologer: "Pandit Pravin Shriram",
        gender: "Female",
        preferredDate: "2024-05-15",
        preferredTime: "11:30 AM",
        status: "Pending",
        notes: "Wants detailed handwritten Patrika copy.",
        createdAt: new Date("2024-05-14T10:05:00Z")
    },
    {
        name: "Mahesh Gaikwad",
        phone: "+91 96378 91234",
        email: "mahesh.gaikwad@gmail.com",
        birthDate: "12/05/1993",
        birthTime: "08:00 AM",
        birthPlace: "Sangli, Maharashtra",
        topic: "Gemstone Guidance (Ratna & Rudraksha)",
        astrologer: "Pandit Pravin Shriram",
        gender: "Male",
        preferredDate: "2024-04-28",
        preferredTime: "03:30 PM",
        status: "Completed",
        notes: "7 Mukhi Nepali Rudraksha consecrated and dispatched.",
        createdAt: new Date("2024-04-27T12:30:00Z")
    }
];

@Injectable()
export class BookingService implements OnModuleInit {
    constructor(
        @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
        private emailService: EmailService,
    ) { }

    async onModuleInit() {
        // Live database mode - real bookings only
    }

    async create(createBookingDto: any): Promise<Booking> {
        const payload = {
            ...createBookingDto,
            phone: createBookingDto.phone || createBookingDto.mobile,
            birthDate: createBookingDto.birthDate || createBookingDto.dob,
            birthTime: createBookingDto.birthTime || createBookingDto.tob,
            birthPlace: createBookingDto.birthPlace || createBookingDto.pob,
            preferredDate: createBookingDto.preferredDate || createBookingDto.date,
            preferredTime: createBookingDto.preferredTime || createBookingDto.time,
        };
        const newBooking = new this.bookingModel(payload);
        await newBooking.save();

        // Async email notification with Google Calendar .ics invite
        try {
            this.emailService.sendBookingConfirmation(newBooking);
        } catch (e) {
            console.warn('Could not dispatch booking email:', e);
        }

        return newBooking;
    }

    async findAll(): Promise<Booking[]> {
        return this.bookingModel.find().sort({ createdAt: -1 }).exec();
    }

    async findById(id: string): Promise<Booking | null> {
        return this.bookingModel.findById(id).exec();
    }

    async updateStatus(id: string, status: string): Promise<Booking | null> {
        return this.bookingModel
            .findByIdAndUpdate(id, { status }, { new: true })
            .exec();
    }

    async remove(id: string): Promise<Booking | null> {
        return this.bookingModel.findByIdAndDelete(id).exec();
    }

    async clearDemoData(): Promise<{ deletedCount: number }> {
        const result = await this.bookingModel.deleteMany({
            name: { $in: ['Rahul Deshmukh', 'Priyanka Kulkarni', 'Amitabh Joshi', 'Snehal Patil', 'Sachin Shinde', 'Ananya Kadam', 'Mahesh Gaikwad'] }
        }).exec();
        return { deletedCount: result.deletedCount || 0 };
    }
}

