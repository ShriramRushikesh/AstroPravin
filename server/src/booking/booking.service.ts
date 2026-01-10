import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { EmailService } from '../shared/email.service';

@Injectable()
export class BookingService {
    constructor(
        @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
        private emailService: EmailService,
    ) { }

    async create(createBookingDto: any): Promise<Booking> {
        const newBooking = new this.bookingModel(createBookingDto);
        await newBooking.save();

        // Async email
        this.emailService.sendBookingConfirmation(newBooking);

        return newBooking;
    }

    async findAll(): Promise<Booking[]> {
        return this.bookingModel.find().sort({ createdAt: -1 }).exec();
    }

    async updateStatus(id: string, status: string): Promise<Booking | null> {
        return this.bookingModel
            .findByIdAndUpdate(id, { status }, { new: true })
            .exec();
    }
}
