import { data } from '../src/commands/mod';

describe('mod command', () => {
  it('registers warn subcommand', () => {
    const json = data.toJSON();
    expect(json.options?.[0]?.name).toBe('warn');
  });
});
