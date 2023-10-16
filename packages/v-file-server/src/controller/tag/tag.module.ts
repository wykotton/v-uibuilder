import { Module } from '@nestjs/common';
import { FilesTagService } from './tag.service';
import { FilesTagController } from './tag.controller';

@Module({
  controllers: [FilesTagController],
  providers: [FilesTagService]
})
export class FilesTagModule {}
