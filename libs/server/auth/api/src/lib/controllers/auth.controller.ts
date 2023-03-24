import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


import { TokenRequestDto, TokenResponseDto, UserInfoDto } from '@nxan/server/auth/app';
import { AuthService } from '@nxan/server/auth/app';
import { AllowAnonymous } from '@nxan/server/auth/public';


@ApiTags('connect')
@Controller('connect')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AllowAnonymous()
  @ApiOperation({ summary: 'Get an access token', operationId: 'get-token' })
  @ApiBody({ type: TokenRequestDto })
  @ApiResponse({ type: TokenResponseDto })
  @UseGuards(AuthGuard(['password-credentials', 'refresh-token']))
  @Post('token')
  async token(@Req() req: Request) {
    return await this.authService.authorize(req['user']);
  }

  @Get('userinfo')
  @ApiResponse({ type: UserInfoDto })
  @ApiOperation({ summary: 'Get user info', operationId: 'get-userinfo' })
  async userinfo() {
    return await this.authService.userinfo();
  }
}
