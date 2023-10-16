import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { EditService } from "./edit.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { query } from "express";

@ApiTags("编辑")
@Controller("ui-builder")
export class EditController {
  constructor(private readonly editService: EditService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get("system-find")
  @ApiOperation({
    summary: "获取页面数据",
    description: "获取UIB实例页面的数据",
  })
  async systemFind(@Req() req) {
    return this.editService.systemFind(req);
  }

  @Get("preview-page")
  @ApiOperation({
    summary: "获取页面数据",
    description: "获取UIB实例页面的数据,供预览使用,不校验用户权限",
  })
  async previewPage(@Query() query) {
    return this.editService.previewPage(query);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("system-save")
  @ApiOperation({
    summary: "新增实例页面",
    description: "新增UIB实例页面数据",
  })
  async systemSave(@Req() req) {
    return this.editService.systemSave(req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("system-update")
  @ApiOperation({
    summary: "修改实例页面",
    description: "修改UIB实例页面数据",
  })
  async systemUpdate(@Req() req) {
    return this.editService.systemUpdate(req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("update-page-name")
  @ApiOperation({
    summary: "修改实例页面名称",
    description: "修改UIB实例页面名称",
  })
  async updatePageName(@Req() req) {
    return this.editService.updatePageName(req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("get-combination")
  @ApiOperation({
    summary: "获取元件集合列表",
    description: "获取元件集合列表",
  })
  async getUserCombination(@Query() query) {
    return this.editService.getCombination(query);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("search-combination")
  @ApiOperation({
    summary: "查询单个元件集合",
    description: "获取单个元件集合的数据",
  })
  async searchCombination(@Query() query) {
    return this.editService.searchCombination(query);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("find-combination")
  @ApiOperation({
    summary: "查找多个元件集合",
    description: "获取多个元件集合的数据",
  })
  async findCombination(@Query() query) {
    return this.editService.findCombination(query);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("save-combination")
  @ApiOperation({
    summary: "保存元件集合(新增和修改)",
    description: "保存元件集合的数据，可保存多个元件集合",
  })
  async saveCombination(@Body() body) {
    return this.editService.saveCombination(body);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("update-combination-name")
  @ApiOperation({
    summary: "修改元件集合名称",
    description: "修改元件集合名称(单个元件集合)",
  })
  async updateCombinationName(@Req() req) {
    return this.editService.updateCombinationName(req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("delete-combination")
  @ApiOperation({
    summary: "删除元件集合",
    description: "删除元件集合的数据，可删除多个元件集合",
  })
  async deleteCombination(@Body() body) {
    return this.editService.deleteCombination(body);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("get-page-warehouse")
  @ApiOperation({
    summary: "获取页面库列表",
    description: "获取页面库的列表数据",
  })
  async getPageWarehouse(@Query() query) {
    return this.editService.getPageWarehouse(query);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("search-page-warehouse")
  @ApiOperation({
    summary: "查询页面库单个页面",
    description: "获取页面库单个页面的数据",
  })
  async searchPageWarehouse(@Query() query) {
    return this.editService.searchPageWarehouse(query);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("find-page-warehouse")
  @ApiOperation({
    summary: "查询页面库多个页面",
    description: "获取页面库多个页面的数据",
  })
  async findPageWarehouse(@Query() query) {
    return this.editService.findPageWarehouse(query);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("save-page-warehouse")
  @ApiOperation({
    summary: "保存页面到页面库(新增和修改)",
    description: "保存页面的数据到页面库，可保存多个页面",
  })
  async savePageWarehouse(@Body() body) {
    return this.editService.savePageWarehouse(body);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("update-page-warehouse-name")
  @ApiOperation({
    summary: "修改页面库页面名称",
    description: "修改页面库页面名称",
  })
  async updatePageWarehouseName(@Req() req) {
    return this.editService.updatePageWarehouseName(req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("delete-page-warehouse")
  @ApiOperation({
    summary: "删除页面库的页面",
    description: "删除页面库的页面数据, 可删除多个页面",
  })
  async deletePageWarehouse(@Body() body) {
    return this.editService.deletePageWarehouse(body);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("load-page-warehouse")
  @ApiOperation({
    summary: "载入页面库的页面",
    description: "载入页面库的页面数据, 将UIB实例页面数据进行覆盖",
  })
  async loadPageWarehouse(@Req() req) {
    return this.editService.loadPageWarehouse(req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("get-child-page")
  @ApiOperation({
    summary: "获取项目子页面列表",
    description: "获取项目子页面列表",
  })
  async getChildPage(@Req() req) {
    return this.editService.getChildPage(req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("find-child-page")
  @ApiOperation({
    summary: "查找项目子页面",
    description: "查找项目子页面",
  })
  async findChildPage(@Req() req) {
    return this.editService.findChildPage(req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("add-child-page")
  @ApiOperation({
    summary: "新增项目子页面",
    description: "新增项目子页面",
  })
  async addChildPage(@Req() req) {
    return this.editService.addChildPage(req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("save-child-page")
  @ApiOperation({
    summary: "保存项目子页面",
    description: "保存项目子页面",
  })
  async saveChildPage(@Req() req) {
    return this.editService.saveChildPage(req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("delete-child-page")
  @ApiOperation({
    summary: "删除项目子页面",
    description: "删除项目子页面",
  })
  async deleteChildPage(@Req() req) {
    return this.editService.deleteChildPage(req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("rename-child-page")
  @ApiOperation({
    summary: "重命名项目子页面",
    description: "重命名项目子页面",
  })
  async renameChildPage(@Req() req) {
    return this.editService.renameChildPage(req);
  }
}
