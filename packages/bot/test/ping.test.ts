import { execute } from '../src/commands/ping';

describe('ping command', () => {
  it('replies with Pong!', async () => {
    const reply = jest.fn();
    const interaction: any = { reply };
    await execute(interaction);
    expect(reply).toHaveBeenCalledWith('Pong!');
  });
});
