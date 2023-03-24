import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import {
  ChangeDisplayName,
  ChangeEmailDto,
  ChangePasswordDto,
  ConfirmEmailChangeDto,
  DeleteAccountDto,
  ForgotPasswordDto,
  RegisterCancelDto,
  RegisterConfirmDto,
  RegisterResendConfirmDto,
  RegisterUserDto,
  ResetPasswordDto,
} from '@nxan/server/auth/app';
import { UsersService } from '@nxan/server/auth/app';
import { AllowAnonymous } from '@nxan/server/auth/public';
import { ResponseResult } from '@nxan/server/dtos';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @AllowAnonymous()
  @Post('register')
  @ApiOperation({ operationId: 'register', summary: 'Register a new user' })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({ type: ResponseResult })
  async register(@Body() model: RegisterUserDto) {
    return await this.usersService.register(model);
  }

  @AllowAnonymous()
  @ApiOperation({ operationId: 'register-confirm', summary: 'Confirm a new user' })
  @ApiBody({ type: RegisterConfirmDto })
  @ApiResponse({ type: ResponseResult })
  @Post('register-confirm')
  async registerConfirm(@Body() model: RegisterConfirmDto) {
    return await this.usersService.registerConfirm(model);
  }

  @AllowAnonymous()
  @ApiOperation({ operationId: 'register-resend', summary: 'Resend confirmation email' })
  @ApiBody({ type: RegisterResendConfirmDto })
  @ApiResponse({ type: ResponseResult })
  @Post('register-resend')
  async registerResend(@Body() model: RegisterResendConfirmDto) {
    return await this.usersService.registerResendConfirm(model);
  }

  @AllowAnonymous()
  @ApiOperation({ operationId: 'register-cancel', summary: 'Cancel registration' })
  @ApiBody({ type: RegisterCancelDto })
  @ApiResponse({ type: ResponseResult })
  @Post('register-cancel')
  async registerCancel(@Body() model: RegisterCancelDto) {
    return await this.usersService.registerCancel(model);
  }

  @Post(':id/change-email')
  @ApiResponse({ type: ResponseResult })
  @ApiBody({ type: ChangeEmailDto })
  @ApiOperation({ operationId: 'change-email', summary: 'Change email address' })
  async changeEmail(@Param('id') id: string, @Body() model: ChangeEmailDto) {
    return await this.usersService.changeEmail(id, model);
  }

  @Post(':id/confirm-email-change')
  @ApiResponse({ type: ResponseResult })
  @ApiBody({ type: ConfirmEmailChangeDto })
  @ApiOperation({ operationId: 'confirm-email-change', summary: 'Confirm email address change' })
  async changeEmailConfirm(@Param('id') id: string, @Body() model: ConfirmEmailChangeDto) {
    return await this.usersService.confirmEmailChange(id, model);
  }

  @Post(':id/change-password')
  @ApiResponse({ type: ResponseResult })
  @ApiBody({ type: ChangePasswordDto })
  @ApiOperation({ operationId: 'change-password', summary: 'Change password' })
  async changePassword(@Param('id') id: string, @Body() model: ChangePasswordDto) {
    return await this.usersService.changePassword(id, model);
  }

  @Post(':id/change-display-name')
  @ApiResponse({ type: ResponseResult })
  @ApiBody({ type: ChangeDisplayName })
  @ApiOperation({ operationId: 'change-display-name', summary: 'Change display name' })
  async changeDisplayName(@Param('id') id: string, @Body() model: ChangeDisplayName) {
    return await this.usersService.changeDisplayName(id, model);
  }

  @Post(':id/delete-account')
  @ApiBody({ type: DeleteAccountDto })
  @ApiResponse({ type: ResponseResult })
  @ApiOperation({ operationId: 'delete-account', summary: 'Delete account' })
  async deleteUser(@Param('id') id: string, @Body() model: DeleteAccountDto) {
    return await this.usersService.deleteUser(id, model);
  }

  @AllowAnonymous()
  @Post('forgot-password')
  @ApiOperation({ operationId: 'forgot-password', summary: 'Forgot password' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ type: ResponseResult })
  async forgotPassword(@Body() model: ForgotPasswordDto) {
    return await this.usersService.forgotPassword(model);
  }

  @AllowAnonymous()
  @Post('reset-password')
  @ApiOperation({ operationId: 'reset-password', summary: 'Reset password' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ type: ResponseResult })
  async resetPassword(@Body() model: ResetPasswordDto) {
    return await this.usersService.resetPassword(model);
  }
}
