import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  AutomodConfigSchema,
  ModerationConfigSchema,
  AutomodConfig,
  ModerationConfig,
} from '@terminal-x/shared';

@Injectable()
export class GuildService {
  constructor(private prisma: PrismaService) {}

  getModerationConfig(guildId: string): Promise<ModerationConfig | null> {
    return this.prisma.moderationConfig.findUnique({ where: { guildId } });
  }

  async setModerationConfig(guildId: string, data: ModerationConfig) {
    const parsed = ModerationConfigSchema.parse(data);
    return this.prisma.moderationConfig.upsert({
      where: { guildId },
      update: parsed,
      create: { guildId, ...parsed },
    });
  }

  getAutomodConfig(guildId: string): Promise<AutomodConfig | null> {
    return this.prisma.automodConfig.findUnique({ where: { guildId } });
  }

  async setAutomodConfig(guildId: string, data: AutomodConfig) {
    const parsed = AutomodConfigSchema.parse(data);
    return this.prisma.automodConfig.upsert({
      where: { guildId },
      update: parsed,
      create: { guildId, ...parsed },
    });
  }

  getCases(guildId: string, userId?: string) {
    return this.prisma.moderationCase.findMany({
      where: { guildId, targetId: userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  getCase(guildId: string, caseId: string) {
    return this.prisma.moderationCase.findFirst({
      where: { guildId, id: caseId },
    });
  }

  async createCase(guildId: string, data: any) {
    return this.prisma.moderationCase.create({
      data: { guildId, ...data },
    });
  }

  getLogs(guildId: string) {
    return this.prisma.logEvent.findMany({
      where: { guildId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}
