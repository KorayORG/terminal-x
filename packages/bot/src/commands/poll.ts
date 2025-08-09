import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

// Simple poll command: creates a poll with options reacted by number emojis
const numberEmojis = ['\u0031\u20E3','\u0032\u20E3','\u0033\u20E3','\u0034\u20E3','\u0035\u20E3','\u0036\u20E3','\u0037\u20E3','\u0038\u20E3','\u0039\u20E3','\uD83D\uDD1F'];

export const data = new SlashCommandBuilder()
  .setName('poll')
  .setDescription('Create and manage polls')
  .addSubcommand(sub =>
    sub.setName('create')
      .setDescription('Create a new poll')
      .addStringOption(opt =>
        opt.setName('question')
          .setDescription('Poll question')
          .setRequired(true)
      )
      .addStringOption(opt =>
        opt.setName('options')
          .setDescription('Comma-separated list of options (2-10)')
          .setRequired(true)
      )
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const sub = interaction.options.getSubcommand();
  if (sub !== 'create') {
    await interaction.reply({ content: 'Unknown subcommand.', ephemeral: true });
    return;
  }
  const question = interaction.options.getString('question', true);
  const optionsStr = interaction.options.getString('options', true);
  const opts = optionsStr.split(',').map(o => o.trim()).filter(o => o.length > 0);
  if (opts.length < 2 || opts.length > 10) {
    await interaction.reply({ content: 'Please provide between 2 and 10 options, separated by commas.', ephemeral: true });
    return;
  }
  const description = opts.map((opt, i) => `${numberEmojis[i]} ${opt}`).join('\n');
  const embed = new EmbedBuilder()
    .setTitle(question)
    .setDescription(description)
    .setColor(0x2f3136);
  const channel: any = interaction.channel;
  if (!channel || typeof channel.send !== 'function') {
    await interaction.reply({ content: 'Cannot create poll in this channel.', ephemera: true });
    return;
  }
  const message = await channel.send({ embeds: [embed] });
  for (let i = 0; i < opts.length; i++) {
    await message.react(numberEmojis[i]);
  }
  await interaction.reply({ content: 'Poll created!', ephemera: true });
}
