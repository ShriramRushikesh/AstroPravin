import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BookingService } from './booking.service';
import { Booking } from './schemas/booking.schema';
import { EmailService } from '../shared/email.service';

describe('BookingService', () => {
  let service: BookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: getModelToken(Booking.name),
          useValue: {
            find: jest.fn().mockReturnValue({ sort: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([]) }) }),
            findById: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
            save: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: EmailService,
          useValue: { sendBookingConfirmation: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
