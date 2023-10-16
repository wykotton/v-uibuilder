import { log } from "#/log";
import { uiBuilderMapping } from "@/dao";
import { getConfigJson, linkDb, setConfigJson } from "@/utils/utils";
import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { SettingService } from "./setting.service";

@ApiTags("设置")
@Controller("ui-builder")
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @UseGuards(AuthGuard("jwt"))
  @Post("save-config")
  @ApiOperation({
    summary: "保存UIB配置",
    description: "保存UIB全局配置项数据",
  })
  async saveConfig(@Req() req: Request, @Res() res: Response) {
    try {
      const config = getConfigJson("./conf/ui-config.json");
      Object.assign(config, req.body);

      setConfigJson("./conf/ui-config.json", config);
      res.send({ results: config, info: { msg: `success` } });
    } catch (error) {
      console.log(error);
      log.info(error, `保存配置信息失败`);
      res.send({ results: error, info: { msg: `fail` } });
    }
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("system-config")
  @ApiOperation({
    summary: "获取UIB配置",
    description: "获取UIB全局配置项数据",
  })
  async systemConfig() {
    try {
      const config = getConfigJson("./conf/ui-config.json");
      log.info(config, `配置信息`);

      return config;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("preview-config")
  @ApiOperation({
    summary: "获取UIB配置",
    description: "获取UIB全局配置项数据,供预览使用,不校验用户权限",
  })
  async previewConfig() {
    try {
      const config = getConfigJson("./conf/ui-config.json");
      return config;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post("query-database-data")
  @ApiOperation({
    summary: "请求数据库",
    description: "用于前端请求数据库需求",
  })
  async queryDatabaseData(@Body() body) {
    return this.settingService.queryDatabaseData(body);
  }

  @Get("query-config")
  async queryConfig(@Query() query: any) {
    try {
      console.log(query);

      const { configInfo } = uiBuilderMapping;
      // const [config = {}] = await searchSql(configInfo, []);
      return configInfo;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post("http-proxy")
  @ApiOperation({
    summary: "跨域代理接口",
    description: "用于前端请求其他的跨域接口进行中转服务",
  })
  async httpProxy(@Body() body) {
    return this.settingService.httpProxy(body);
  }
}
