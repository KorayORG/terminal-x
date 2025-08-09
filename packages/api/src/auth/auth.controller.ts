import { Controller, Get, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('discord')
  login(@Res() res: Response) {
    const url = this.authService.getDiscordAuthUrl();
    return res.redirect(url);
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Res() res: Response) {
    const token = await this.authService.exchangeCode(code);
    res.cookie('token', token, { httpOnly: true });
    return res.json({ token });
  }
}
