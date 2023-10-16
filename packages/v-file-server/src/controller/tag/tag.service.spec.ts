import { Test, TestingModule } from '@nestjs/testing';
import { FilesTagService } from './tag.service';

describe('FilesTagService', () => {
  let service: FilesTagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilesTagService],
    }).compile();

    service = module.get<FilesTagService>(FilesTagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
