import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { SharedService } from './shared.service';
import { Visitor } from './schemas/visitor.schema';
import { Video } from './schemas/video.schema';

describe('SharedService', () => {
  let service: SharedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SharedService,
        {
          provide: getModelToken(Visitor.name),
          useValue: {
            findOne: jest.fn().mockResolvedValue(null),
            save: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: getModelToken(Video.name),
          useValue: {
            find: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    service = module.get<SharedService>(SharedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
