
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Delete,
} from '@nestjs/common';

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


  // Embed templates
  @Get('templates')
  getTemplates(@Param('id') guildId: string) {
    return this.service.getTemplates(guildId);
  }

  @Post('templates')
  createTemplate(
    @Param('id') guildId: string,
    @Body() body: any,
  ) {
    return this.service.createTemplate(guildId, body);
  }

  @Delete('templates/:templateId')
  deleteTemplate(
    @Param('id') guildId: string,
    @Param('templateId') templateId: string,
  ) {
    return this.service.deleteTemplate(guildId, templateId);
  }

  // Announcements
  @Get('announcements')
  getAnnouncements(@Param('id') guildId: string) {
    return this.service.getAnnouncements(guildId);
  }

  @Post('announcements')
  createAnnouncement(
    @Param('id') guildId: string,
    @Body() body: any,
  ) {
    return this.service.createAnnouncement(guildId, body);
  }

  @Post('announcements/:announcementId/cancel')
  cancelAnnouncement(
    @Param('id') guildId: string,
    @Param('announcementId') announcementId: string,
  ) {
    return this.service.cancelAnnouncement(guildId, announcementId);
  }

  // Reminders
  @Get('reminders')
  getReminders(@Param('id') guildId: string) {
    return this.service.getReminders(guildId);
  }

  @Post('reminders')
  createReminder(
    @Param('id') guildId: string,
    @Body() body: any,
  ) {
    return this.service.createReminder(guildId, body);
  }

  @Delete('reminders/:reminderId')
  deleteReminder(
    @Param('id') guildId: string,
    @Param('reminderId') reminderId: string,
  ) {
    return this.service.deleteReminder(guildId, reminderId);
  }

}
