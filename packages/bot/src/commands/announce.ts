import { SlashCommandBuilder, ChatInputCommandInteraction, ChannelType } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('announce')
  .setDescription('Announcement commands')
  .addSubcommand((sub) =>
    sub
      .setName('create')
      .setDescription('Send an announcement')
      .addChannelOption((opt) =>
        opt
          .setName('channel')
          .setDescription('Target channel')
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(true)
      )
      .addStringOption((opt) =>
        opt
          .setName('content')
          .setDescription('Announcement content')
          .setRequired(true)
      )
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  if (interaction.options.getSubcommand() !== 'create') return;
  const channel = interaction.options.getChannel('channel');
  const content = interaction.options.getString('content', true);
  if (!channel || !('send' in channel)) {
    await interaction.reply({ content: 'Invalid channel', ephemeral: true });
    return;
  }
  await (channel as any).send(content);
  await interaction.reply({ content: 'Announcement sent', ephemeral: true });
}
