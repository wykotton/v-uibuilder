import { Body, Controller, Get, Post,Patch, Query, Req, Param, ParseIntPipe, UseGuards, UseInterceptors, UploadedFile, UploadedFiles, Delete } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express"
import { FilesService } from "./files.service";
import { ApiOperation, ApiTags, ApiHeader, ApiParam, ApiProperty, ApiQuery, ApiBearerAuth, ApiConsumes } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { query } from "express";
import multer = require('multer');
import * as path from 'path';
import { randomString, getConfigJson, getLocalIP } from "@/utils/utils";
import { staticBaseUrl } from './constants';
const { port } = getConfigJson('./conf/config.json') as any;

@ApiTags("文件")
@Controller("fileman")
@ApiBearerAuth()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}
  // 单文件上传
  @UseGuards(AuthGuard("jwt"))
  @Post('upload/file')
  @ApiOperation({
    summary: "文件上传",
    description: "上传文件",
  })
  @ApiParam({ name: 'file', description: '文件' })
  @UseInterceptors(FileInterceptor('file[]', {
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.join(process.cwd(), 'upload'));
      },
      filename: (req, file, cb) => {
        const extArr = file.originalname.split('.')
        const extName = extArr.length > 1 ? ('.'+extArr.pop()) : ''
        cb(null, randomString(16) + extName)
      },
    }),
  }))
  @ApiConsumes('multipart/form-data')
  uploadFile(@UploadedFile() file: Express.Multer.File, @Body() fileInfo, @Req() req) {
    // console.log(file, fileInfo, req);
    return this.filesService.saveFiles({file, fileInfo, req});
    // return {
      // file: staticBaseUrl + file.originalname,
    // };
  }
  // 上传演示(不入库)
  @UseGuards(AuthGuard("jwt"))
  @Post('upload/mock')
  @ApiOperation({
    summary: "文件上传",
    description: "上传文件",
  })
  @ApiParam({ name: 'file', description: '文件' })
  @UseInterceptors(FileInterceptor('file[]', {
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.join(process.cwd(), 'upload/temp'));
      },
      filename: (req, file, cb) => {
        const extArr = file.originalname.split('.')
        const extName = extArr.length > 1 ? ('.'+extArr.pop()) : ''
        cb(null, randomString(16) + extName)
      },
    }),
  }))
  @ApiConsumes('multipart/form-data')
  mockUpload(@UploadedFile() file: Express.Multer.File) {
    // console.log(staticBaseUrl, file);
    return {
      file: `http://${getLocalIP()}:${port}${staticBaseUrl}temp/${file.filename}`,
    };
  }

  // 多文件上传
  @Post('upload/files')
  @UseInterceptors(FileInterceptor('files'))
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    // console.log(1,files);
    // .map((f) => staticBaseUrl + f.originalname)
    return {
      files: `http://${getLocalIP()}:${port}/${files}`,
    };
  }
  // 文件分页查询
  @UseGuards(AuthGuard("jwt"))
  @Get("get-files")
  @ApiOperation({
    summary: "查询文件集合",
    description: "获取文件集合的数据",
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Auth token',
  })
  @ApiQuery({ name: 'page', description: '分页信息描述', required: true, type: Number })
  async getFiles(@Query() query, @Req() req) {
    return this.filesService.getFiles({query, req});
  }
  // 删除文件
  @UseGuards(AuthGuard("jwt"))
  @Delete("delete-files")
  @ApiOperation({
    summary: "删除文件",
    description: "删除文件的数据，可批量删除",
  })
  async deleteFiles(@Body() body, @Req() req) {
    return this.filesService.deleteFiles({body, req});
  }
  // 修改文件
  @UseGuards(AuthGuard("jwt"))
  @Patch("update-files/:id")
  @ApiOperation({
    summary: "修改文件",
    description: "修改文件的数据",
  })
  async updateFiles(@Param('id', ParseIntPipe) id: number, @Body() body, @Req() req) {
    return this.filesService.updateFiles({id, body, req});
  }
  // 导出
  @UseGuards(AuthGuard("jwt"))
  @Post("export-files")
  @ApiOperation({
    summary: "导出文件",
    description: "导出文件的数据",
  })
  async exportFiles(@Body() body, @Req() req) {
    return this.filesService.exportFiles({body, req});
  }
  // 导入
  @UseGuards(AuthGuard("jwt"))
  @Post("import-files")
  @ApiOperation({
    summary: "导出文件",
    description: "导出文件的数据",
  })
  @UseInterceptors(FileInterceptor('file[]', {
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.join(process.cwd(), 'upload/temp'));
      },
      filename: (req, file: any, cb) => {
        const extArr = file.originalname.split('.')
        const extName = extArr.length > 1 ? ('.'+extArr.pop()) : ''
        file.rename = randomString(16)
        cb(null, file.rename + extName)
      },
    }),
  }))
  async importFiles(@UploadedFile() file: Express.Multer.File, @Body() body, @Req() req) {
    return this.filesService.importFiles({file, body, req});
  }
}
