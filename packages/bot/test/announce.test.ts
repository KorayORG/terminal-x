import { execute } from '../src/commands/announce';

describe('announce command', () => {
  it('sends announcement', async () => {
    const send = jest.fn();
    const reply = jest.fn();
    const interaction: any = {
      options: {
        getSubcommand: () => 'create',
        getChannel: () => ({ send }),
        getString: () => 'hello',
      },
      reply,
    };
    await execute(interaction);
    expect(send).toHaveBeenCalledWith('hello');
    expect(reply).toHaveBeenCalled();
  });
});
