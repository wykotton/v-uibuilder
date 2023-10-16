import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('身份验证')
@Controller('ui-builder')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: '登录',
    description: '统一登录接口',
  })
  async login(@Body() body) {
    return this.authService.login(body);
  }

  @Post('register')
  @ApiOperation({
    summary: '注册',
    description: '用户注册接口',
  })
  async register(@Body() body) {
    return this.authService.register(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('refresh-token')
  @ApiOperation({
    summary: '刷新token',
    description: '刷新token',
  })
  async refreshToken(@Req() req) {
    return this.authService.refreshToken(req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('get-theme')
  @ApiOperation({
    summary: '获取主题',
    description: '获取用户主题',
  })
  async getTheme(@Req() req) {
    return this.authService.getTheme(req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('update-theme')
  @ApiOperation({
    summary: '变更主题',
    description: '变更用户主题',
  })
  async updateTheme(@Req() req) {
    return this.authService.updateTheme(req);
  }
}
