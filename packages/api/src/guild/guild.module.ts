import { Module } from '@nestjs/common';
import { GuildController } from './guild.controller';
import { GuildService } from './guild.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [GuildController],
  providers: [GuildService, PrismaService],
})
export class GuildModule {}
