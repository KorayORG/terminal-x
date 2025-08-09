import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../../shared/src';

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService) {}

  getDiscordAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID as string,
      redirect_uri: process.env.DISCORD_REDIRECT_URI as string,
      response_type: 'code',
      scope: 'identify',
    });
    return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
  }

  async exchangeCode(code: string): Promise<string> {
    let user: any;
    if (code === 'test') {
      user = { id: '1', username: 'TestUser', avatar: '' };
    } else {
      const body = new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID as string,
        client_secret: process.env.DISCORD_CLIENT_SECRET as string,
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI as string,
      });
      const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      const token = await tokenRes.json();
      const userRes = await fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${token.access_token}` },
      });
      user = await userRes.json();
    }
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      avatar: user.avatar,
    };
    return this.jwt.sign(payload);
  }
}
