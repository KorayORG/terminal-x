import { SlashCommandBuilder, ChatInputCommandInteraction, TextChannel } from 'discord.js';

const templates: Record<string, string> = {};
const schedules: NodeJS.Timeout[] = [];

export const data = new SlashCommandBuilder()
  .setName('announcetemplate')
  .setDescription('Manage announcement templates and schedule announcements.')
  .addSubcommand(sub =>
    sub.setName('create')
      .setDescription('Create a new announcement template.')
      .addStringOption(opt => opt.setName('name').setDescription('Template name').setRequired(true))
      .addStringOption(opt => opt.setName('content').setDescription('Message content').setRequired(true))
  )
  .addSubcommand(sub =>
    sub.setName('list')
      .setDescription('List all templates.')
  )
  .addSubcommand(sub =>
    sub.setName('schedule')
      .setDescription('Schedule an announcement using a template.')
      .addStringOption(opt => opt.setName('name').setDescription('Template name').setRequired(true))
      .addIntegerOption(opt => opt.setName('minutes').setDescription('Minutes after which to send the announcement').setRequired(true))
      .addChannelOption(opt => opt.setName('channel').setDescription('Target channel').setRequired(true))
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const sub = interaction.options.getSubcommand();
  if (sub === 'create') {
    const name = interaction.options.getString('name', true);
    const content = interaction.options.getString('content', true);
    templates[name] = content;
    await interaction.reply({ content: `Template \`${name}\` created.`, ephemeral: true });
  } else if (sub === 'list') {
    const keys = Object.keys(templates);
    if (keys.length === 0) {
      await interaction.reply({ content: 'No templates found.', ephemeral: true });
    } else {
      await interaction.reply({ content: 'Templates: ' + keys.join(', '), ephemeral: true });
    }
  } else if (sub === 'schedule') {
    const name = interaction.options.getString('name', true);
    const minutes = interaction.options.getInteger('minutes', true);
    const channel = interaction.options.getChannel('channel', true) as TextChannel;
    const content = templates[name];
    if (!content) {
      await interaction.reply({ content: `Template \`${name}\` not found.`, ephemeral: true });
      return;
    }
    await interaction.reply({ content: `Scheduled announcement \`${name}\` to be sent in ${minutes} minutes.`, ephemeral: true });
    const timer = setTimeout(async () => {
      try {
        await channel.send(content);
      } catch (err) {
        console.error(err);
      }
    }, minutes * 60 * 1000);
    schedules.push(timer);
  } else {
    await interaction.reply({ content: 'Unknown subcommand.', ephemeral: true });
  }
}
