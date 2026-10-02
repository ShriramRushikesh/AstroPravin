import { Test, TestingModule } from '@nestjs/testing';
import { KundliController } from './kundli.controller';
import { KundliService } from './kundli.service';
import { PdfGenerator } from './pdf.generator';

describe('KundliController', () => {
  let controller: KundliController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KundliController],
      providers: [
        {
          provide: KundliService,
          useValue: {
            generateKundli: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: PdfGenerator,
          useValue: {
            generatePdf: jest.fn().mockResolvedValue(Buffer.from('mock_pdf')),
          },
        },
      ],
    }).compile();

    controller = module.get<KundliController>(KundliController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
