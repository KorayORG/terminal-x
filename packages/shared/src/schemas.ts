import { z } from 'zod';

export const ModerationConfigSchema = z.object({
  enabled: z.boolean().default(true),
  modLogChannelId: z.string().optional().nullable(),
  quarantineRoleId: z.string().optional().nullable(),
  escalationStages: z.any().optional(),
  dmNotifyOnAction: z.boolean().default(true),
  defaultMuteMins: z.number().int().default(10),
});

export const AutomodConfigSchema = z.object({
  enabled: z.boolean().default(true),
  exemptRoleIds: z.array(z.string()).default([]),
  exemptChannelIds: z.array(z.string()).default([]),
  profanityEnabled: z.boolean().default(true),
  linkBlockEnabled: z.boolean().default(true),
  inviteBlockEnabled: z.boolean().default(true),
  capsEnabled: z.boolean().default(true),
  repeatEnabled: z.boolean().default(true),
  spamEnabled: z.boolean().default(true),
  mentionSpamEnabled: z.boolean().default(true),
  emojiSpamEnabled: z.boolean().default(false),
  attachmentFilter: z.boolean().default(false),
  nsfwImageCheck: z.boolean().default(false),
  capsThresholdPct: z.number().int().default(80),
  repeatThreshold: z.number().int().default(3),
  spamMsgsPerInterval: z.number().int().default(6),
  spamIntervalSec: z.number().int().default(4),
  mentionMaxPerMsg: z.number().int().default(5),
  emojiMaxPerMsg: z.number().int().default(10),
  actionChain: z.any().optional(),
});

export const CaseActionSchema = z.enum([
  'WARN',
  'MUTE',
  'UNMUTE',
  'KICK',
  'BAN',
  'UNBAN',
  'SOFTBAN',
  'NOTE',
  'TIMEOUT',
  'DELETE_MSG',
]);

export const EmbedFieldSchema = z.object({
  name: z.string(),
  value: z.string(),
  inline: z.boolean().optional(),
});

export const EmbedTemplateSchema = z.object({
  name: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  color: z.number().int().optional(),
  thumbnail: z.string().url().optional(),
  image: z.string().url().optional(),
  footer: z.string().optional(),
  fields: z.array(EmbedFieldSchema).optional(),
});

export const AnnouncementSchema = z.object({
  channelId: z.string(),
  templateId: z.string().optional(),
  content: z.string().optional(),
  scheduleAt: z.string().datetime().optional(),
});

export const ReminderSchema = z.object({
  channelId: z.string().optional(),
  content: z.string(),
  remindAt: z.string().datetime(),
});
