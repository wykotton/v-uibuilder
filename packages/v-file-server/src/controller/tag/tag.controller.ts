import { Body, Controller, Get, Post,Patch, Query, Req, Param, ParseIntPipe, UseGuards, UseInterceptors, Delete } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express"
import { FilesTagService } from "./tag.service";
import { ApiOperation, ApiTags, ApiHeader, ApiParam, ApiProperty, ApiQuery, ApiBearerAuth, ApiConsumes } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { query } from "express";

@ApiTags("标签")
@Controller("filetag")
@ApiBearerAuth()
export class FilesTagController {
  constructor(private readonly tagService: FilesTagService) {}
  // 单标签上传
  @UseGuards(AuthGuard("jwt"))
  @Post('add-tag')
  @ApiOperation({
    summary: "标签添加",
    description: "标签添加接口",
  })
  async saveFilesTag(@Body() body, @Req() req) {
    return this.tagService.saveFilesTag({body, req});
  }
  // 标签分页查询
  @UseGuards(AuthGuard("jwt"))
  @Get("get-tag")
  @ApiOperation({
    summary: "查询标签集合",
    description: "获取标签集合的数据",
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Auth token',
  })
  @ApiQuery({ name: 'page', description: '分页信息描述', required: true, type: Number })
  async getFilesTag(@Query() query, @Req() req) {
    return this.tagService.getFilesTag({query, req});
  }
  // 删除标签
  @UseGuards(AuthGuard("jwt"))
  @Delete("delete-tag")
  @ApiOperation({
    summary: "删除标签",
    description: "删除标签的数据，可批量删除",
  })
  async deleteFilesTag(@Body() body, @Req() req) {
    return this.tagService.deleteFilesTag({body, req});
  }
  // 修改标签
  @UseGuards(AuthGuard("jwt"))
  @Patch("update-tag/:id")
  @ApiOperation({
    summary: "修改标签",
    description: "修改标签的数据",
  })
  async updateFilesTag(@Param('id', ParseIntPipe) id: number, @Body() body, @Req() req) {
    return this.tagService.updateFilesTag({id, body, req});
  }
}
