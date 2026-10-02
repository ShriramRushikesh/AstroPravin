import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { KundliService } from './kundli.service';
import { Lead } from './schemas/lead.schema';
import { EmailService } from '../shared/email.service';

describe('KundliService', () => {
  let service: KundliService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KundliService,
        {
          provide: getModelToken(Lead.name),
          useValue: {
            find: jest.fn().mockResolvedValue([]),
            save: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: EmailService,
          useValue: { sendKundliEmail: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<KundliService>(KundliService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
