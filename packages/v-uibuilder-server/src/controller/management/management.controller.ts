import { Controller, Get, Query, Post, Body, UseGuards, Req } from "@nestjs/common";
import { ManagementService } from "./management.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("管理")
@Controller("ui-builder")
export class ManagementController {
  constructor(private readonly managementService: ManagementService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get("page-info")
  @ApiOperation({
    summary: "获取UIB实例页面数据列表",
    description: "获取UIB实例页面数据列表",
  })
  async systemFind(@Query() query) {
    return this.managementService.pageInfo(query);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("delete-info")
  @ApiOperation({
    summary: "删除UIB实例页面",
    description: "删除UIB实例页面数据",
  })
  async deleteInfo(@Req() req) {
    return this.managementService.deleteInfo(req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("get-project")
  @ApiOperation({
    summary: "获取项目列表",
    description: "获取项目列表数据",
  })
  async getProject(@Req() req) {
    return this.managementService.getProject(req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("find-project")
  @ApiOperation({
    summary: "查询项目信息",
    description: "查询单个项目的数据",
  })
  async findProject(@Req() req) {
    return this.managementService.findProject(req);
  }

  @Get("preview-project")
  @ApiOperation({
    summary: "查询项目信息",
    description: "查询单个项目的数据,供预览使用,不校验用户权限",
  })
  async previewProject(@Query() query) {
    return this.managementService.previewProject(query);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("save-project")
  @ApiOperation({
    summary: "新增项目",
    description: "新增项目数据",
  })
  async saveProject(@Req() req) {
    return this.managementService.saveProject(req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("update-project")
  @ApiOperation({
    summary: "修改项目配置数据",
    description: "修改项目的公共配置数据",
  })
  async updateProject(@Body() body) {
    return this.managementService.updateProject(body);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("update-project-name")
  @ApiOperation({
    summary: "修改项目名称",
    description: "修改项目名称",
  })
  async updateProjectName(@Req() req) {
    return this.managementService.updateProjectName(req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("import-project")
  @ApiOperation({
    summary: "导入项目",
    description: "导入项目数据, 可导入多个项目",
  })
  async importProject(@Req() req) {
    return this.managementService.importProject(req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("delete-project")
  @ApiOperation({
    summary: "删除项目",
    description: "删除项目数据",
  })
  async deleteProject(@Req() req) {
    return this.managementService.deleteProject(req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("get-website")
  @ApiOperation({
    summary: "获取站点列表",
    description: "获取站点列表数据",
  })
  async getWebsite(@Req() req) {
    return this.managementService.getWebsite(req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("find-website")
  @ApiOperation({
    summary: "查询站点信息",
    description: "查询单个站点的数据",
  })
  async findWebsite(@Req() req) {
    return this.managementService.findWebsite(req);
  }

  @Get("preview-website")
  @ApiOperation({
    summary: "查询站点信息",
    description: "查询单个站点的数据,供预览使用,不校验用户权限",
  })
  async previewWebsite(@Query() query) {
    return this.managementService.previewWebsite(query);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("save-website")
  @ApiOperation({
    summary: "新增站点",
    description: "新增站点数据",
  })
  async saveWebsite(@Req() req) {
    return this.managementService.saveWebsite(req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("update-website")
  @ApiOperation({
    summary: "修改站点",
    description: "修改站点数据",
  })
  async updateWebsite(@Req() req) {
    return this.managementService.updateWebsite(req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("update-website-name")
  @ApiOperation({
    summary: "修改站点名称",
    description: "修改站点名称",
  })
  async updateWebsiteName(@Req() req) {
    return this.managementService.updateWebsiteName(req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("delete-website")
  @ApiOperation({
    summary: "删除站点",
    description: "删除站点数据",
  })
  async deleteWebsite(@Req() req) {
    return this.managementService.deleteWebsite(req);
  }
}
