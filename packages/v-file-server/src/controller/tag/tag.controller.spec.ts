import { Test, TestingModule } from '@nestjs/testing';
import { FilesTagController } from './tag.controller';
import { FilesTagService } from './tag.service';

describe('FilesTagController', () => {
  let controller: FilesTagController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesTagController],
      providers: [FilesTagService],
    }).compile();

    controller = module.get<FilesTagController>(FilesTagController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
