import { Test, TestingModule } from '@nestjs/testing';
import { KundliController } from './kundli.controller';

describe('KundliController', () => {
  let controller: KundliController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KundliController],
    }).compile();

    controller = module.get<KundliController>(KundliController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
