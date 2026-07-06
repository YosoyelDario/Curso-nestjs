import { Test, TestingModule } from '@nestjs/testing';
import { GetimgService } from './getimg.service';

describe('GetimgService', () => {
  let service: GetimgService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetimgService],
    }).compile();

    service = module.get<GetimgService>(GetimgService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
