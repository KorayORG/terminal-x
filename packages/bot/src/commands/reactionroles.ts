import { SlashCommandBuilder, ChatInputCommandInteraction, Role } from 'discord.js';

// Geçici bellek içi saklama; kalıcı hale getirmek için DB kullanabilirsiniz.
export const reactionRoleMessages: Record<string, Record<string, string>> = {};

export const data = new SlashCommandBuilder()
  .setName('reactionroles')
  .setDescription('Setup reaction roles.')
  .setDMPermission(false)
  .addSubcommand(sub =>
    sub.setName('setup')
      .setDescription('Create a reaction role message')
      .addChannelOption(opt =>
        opt.setName('channel')
          .setDescription('Channel to send the message')
          .setRequired(true)
      )
      .addStringOption(opt =>
        opt.setName('text')
          .setDescription('Content of the message')
          .setRequired(true)
      )
  )
  .addSubcommand(sub =>
    sub.setName('add')
      .setDescription('Add an emoji -> role mapping')
      .addStringOption(opt =>
        opt.setName('messageid')
          .setDescription('ID of the reaction role message')
          .setRequired(true)
      )
      .addStringOption(opt =>
        opt.setName('emoji')
          .setDescription('Emoji to react with')
          .setRequired(true)
      )
      .addRoleOption(opt =>
        opt.setName('role')
          .setDescription('Role to give')
          .setRequired(true)
      )
  )
  .addSubcommand(sub =>
    sub.setName('remove')
      .setDescription('Remove an emoji mapping')
      .addStringOption(opt =>
        opt.setName('messageid')
          .setDescription('ID of the reaction role message')
          .setRequired(true)
      )
      .addStringOption(opt =>
        opt.setName('emoji')
          .setDescription('Emoji to remove')
          .setRequired(true)
      )
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const sub = interaction.options.getSubcommand();
  if (sub === 'setup') {
    const channel = interaction.options.getChannel('channel');
    const text = interaction.options.getString('text')!;
    if (!channel?.isTextBased()) return interaction.reply({ content: 'Invalid channel', ephemeral: true });

    const message = await channel.send(text);
    reactionRoleMessages[message.id] = {};
    return interaction.reply({ content: `Reaction role message created with ID ${message.id}`, ephemeral: true });
  }

  const messageId = interaction.options.getString('messageid')!;
  if (!reactionRoleMessages[messageId]) return interaction.reply({ content: 'Unknown message ID', ephemeral: true });

  if (sub === 'add') {
    const emoji = interaction.options.getString('emoji')!;
    const role = interaction.options.getRole('role') as Role;
    reactionRoleMessages[messageId][emoji] = role.id;

    const channel = interaction.channel;
    const msg = await channel?.messages.fetch(messageId);
    await msg?.react(emoji);
    return interaction.reply({ content: `Mapped ${emoji} to ${role.name}`, ephemeral: true });
  }

  if (sub === 'remove') {
    const emoji = interaction.options.getString('emoji')!;
    delete reactionRoleMessages[messageId][emoji];
    return interaction.reply({ content: `Removed mapping for ${emoji}`, ephemeral: true });
  }
}
