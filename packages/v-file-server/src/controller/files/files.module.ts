import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as _ from 'lodash';
const moment = require('moment');

@Module({
  imports: [
    MulterModule.register({
      fileFilter(req, file: any, callback) {
        const escapeName = Buffer.from(file.originalname, "latin1").toString("utf8")
        const extArr = escapeName.split('.')
        let fileName = escapeName
        let extName = ''
        if (extArr.length > 1) {
          extName = '.'+extArr.pop()
          fileName = extArr.join('')
        }
        // file.originalname = `${fileName}_${moment().format('YYYYMMDD')}${_.random(100000, 999999)}${extName}`;
        file.originalname = escapeName;
        file.ext = extName
        file.name = fileName
        callback(null, true);
      },
      // storage: diskStorage({
      //   destination: path.join(process.cwd(), 'upload'),
      //   filename(req, file, cb) { // todo: 未做预处理压缩
      //     const extArr = file.originalname.split('.')
      //     const extName = extArr.length > 1 ? ('.'+extArr.pop()) : ''
      //     cb(null, randomString(16) + extName)
      //   },
      // }),
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService]
})
export class FilesModule {}
