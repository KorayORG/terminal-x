
import { z } from 'zod';
import {
  ModerationConfigSchema,
  AutomodConfigSchema,
  CaseActionSchema,
} from './schemas';


export interface JwtPayload {
  sub: string;
  username: string;
  avatar: string;
}


export type ModerationConfig = z.infer<typeof ModerationConfigSchema>;
export type AutomodConfig = z.infer<typeof AutomodConfigSchema>;
export type CaseAction = z.infer<typeof CaseActionSchema>;

