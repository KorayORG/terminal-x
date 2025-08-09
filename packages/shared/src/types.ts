import { z } from 'zod';
import {
  ModerationConfigSchema,
  AutomodConfigSchema,
  CaseActionSchema,
  EmbedTemplateSchema,
  AnnouncementSchema,
  ReminderSchema,
} from './schemas';

export interface JwtPayload {
  sub: string;
  username: string;
  avatar: string;
}

export type ModerationConfig = z.infer<typeof ModerationConfigSchema>;
export type AutomodConfig = z.infer<typeof AutomodConfigSchema>;
export type CaseAction = z.infer<typeof CaseActionSchema>;
export type EmbedTemplate = z.infer<typeof EmbedTemplateSchema>;
export type Announcement = z.infer<typeof AnnouncementSchema>;
export type Reminder = z.infer<typeof ReminderSchema>;
