import {
  AutomodConfigSchema,
  ModerationConfigSchema,
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
});
