import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';

import { GuildModule } from './guild/guild.module';

@Module({
  imports: [AuthModule, GuildModule],

})

export class AppModule {}
