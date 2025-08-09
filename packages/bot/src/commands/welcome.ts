import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember } from 'discord.js';

// Basit bellek içi yapı; kalıcı hale getirmek isterseniz DB kullanın.
export const welcomeConfig: Record<string, { channelId?: string; dm?: boolean; message?: string; roleId?: string }> = {};

export const data = new SlashCommandBuilder()
  .setName('welcome')
  .setDescription('Configure welcome and autorole')
  .setDMPermission(false)
  .addSubcommand(sub =>
    sub.setName('set')
      .setDescription('Set welcome settings')
      .addChannelOption(opt => opt.setName('channel').setDescription('Welcome channel'))
      .addStringOption(opt => opt.setName('message').setDescription('Welcome message (use {user} and {server})'))
      .addBooleanOption(opt => opt.setName('dm').setDescription('Send as DM?'))
      .addRoleOption(opt => opt.setName('autorole').setDescription('Role to give'))
  )
  .addSubcommand(sub =>
    sub.setName('show')
      .setDescription('Show current settings')
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const guildId = interaction.guildId!;
  const sub = interaction.options.getSubcommand();

  if (sub === 'set') {
    const channel = interaction.options.getChannel('channel');
    const message = interaction.options.getString('message');
    const dm = interaction.options.getBoolean('dm');
    const role = interaction.options.getRole('autorole');

    welcomeConfig[guildId] = {
      channelId: channel?.id,
      dm: dm ?? false,
      message: message ?? undefined,
      roleId: role?.id,
    };

    return interaction.reply({ content: 'Welcome configuration updated.', ephemeral: true });
  }

  if (sub === 'show') {
    const config = welcomeConfig[guildId];
    if (!config) return interaction.reply({ content: 'No welcome configuration set.', ephemeral: true });
    return interaction.reply({ content: JSON.stringify(config, null, 2), ephemeral: true });
  }
}

// GuildMemberAdd listener fonksiyonu:
export async function handleMemberJoin(member: GuildMember) {
  const config = welcomeConfig[member.guild.id];
  if (!config) return;
  const text = config.message?.replace('{user}', `<@${member.id}>`).replace('{server}', member.guild.name);
  if (config.roleId) await member.roles.add(config.roleId).catch(() => {});
  if (config.dm && text) await member.send(text).catch(() => {});
  if (config.channelId && text) {
    const channel = member.guild.channels.cache.get(config.channelId);
    if (channel?.isTextBased()) await channel.send(text);
  }
}
