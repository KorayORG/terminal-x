import {
  AutomodConfigSchema,
  ModerationConfigSchema,
  EmbedTemplateSchema,
  AnnouncementSchema,
  ReminderSchema,

} from '@terminal-x/shared';

describe('config schemas', () => {
  it('validates moderation config', () => {
    const parsed = ModerationConfigSchema.parse({ enabled: true });
    expect(parsed.enabled).toBe(true);
  });

  it('rejects invalid automod threshold', () => {
    expect(() =>
      AutomodConfigSchema.parse({ capsThresholdPct: 'high' as any })
    ).toThrow();
  });


  it('validates embed template', () => {
    const tmpl = EmbedTemplateSchema.parse({ name: 'basic' });
    expect(tmpl.name).toBe('basic');
  });

  it('parses announcement schedule date', () => {
    const ann = AnnouncementSchema.parse({
      channelId: '1',
      scheduleAt: new Date().toISOString(),
    });
    expect(ann.channelId).toBe('1');
  });

  it('validates reminder', () => {
    const rem = ReminderSchema.parse({
      content: 'hi',
      remindAt: new Date().toISOString(),
    });
    expect(rem.content).toBe('hi');
  });


});
