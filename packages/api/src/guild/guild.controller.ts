import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { GuildService } from './guild.service';
import { AutomodConfig, ModerationConfig } from '@terminal-x/shared';

@Controller('guilds/:id')
export class GuildController {
  constructor(private service: GuildService) {}

  @Get('moderation-config')
  getModConfig(@Param('id') guildId: string) {
    return this.service.getModerationConfig(guildId);
  }

  @Put('moderation-config')
  setModConfig(@Param('id') guildId: string, @Body() body: ModerationConfig) {
    return this.service.setModerationConfig(guildId, body);
  }

  @Get('automod-config')
  getAutoConfig(@Param('id') guildId: string) {
    return this.service.getAutomodConfig(guildId);
  }

  @Put('automod-config')
  setAutoConfig(@Param('id') guildId: string, @Body() body: AutomodConfig) {
    return this.service.setAutomodConfig(guildId, body);
  }

  @Get('cases')
  getCases(@Param('id') guildId: string, @Query('userId') userId?: string) {
    return this.service.getCases(guildId, userId);
  }

  @Get('cases/:caseId')
  getCase(@Param('id') guildId: string, @Param('caseId') caseId: string) {
    return this.service.getCase(guildId, caseId);
  }

  @Post('cases')
  createCase(@Param('id') guildId: string, @Body() body: any) {
    return this.service.createCase(guildId, body);
  }

  @Get('logs')
  getLogs(@Param('id') guildId: string) {
    return this.service.getLogs(guildId);
  }
}
