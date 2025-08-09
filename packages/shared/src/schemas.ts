import { z } from 'zod';

export const GuildConfigSchema = z.object({
  enabled: z.boolean().default(true),
});
