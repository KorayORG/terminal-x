import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

interface Reminder {
  userId: string;
  channelId: string | null;
  time: number;
  message: string;
  timeout: NodeJS.Timeout;
}

const reminders: Reminder[] = [];

function parseDuration(str: string): number | null {
  const match = str.match(/^(\d+)(s|m|h|d)?$/);
  if (!match) return null;
  const value = parseInt(match[1], 10);
  const unit = match[2] || 'm';
  switch (unit) {
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default: return null;
  }
}

export const data = new SlashCommandBuilder()
  .setName('remind')
  .setDescription('Reminder commands')
  .addSubcommand((sub) =>
    sub
      .setName('me')
      .setDescription('Set a reminder for yourself')
      .addStringOption((opt) =>
        opt
          .setName('time')
          .setDescription('Time until reminder (e.g., 10m, 1h, 30s)')
          .setRequired(true)
      )
      .addStringOption((opt) =>
        opt
          .setName('message')
          .setDescription('Reminder message')
          .setRequired(true)
      )
  )
  .addSubcommand((sub) =>
    sub
      .setName('list')
      .setDescription('List your active reminders')
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const sub = interaction.options.getSubcommand();
  if (sub === 'me') {
    const timeStr = interaction.options.getString('time', true);
    const message = interaction.options.getString('message', true);
    const ms = parseDuration(timeStr);
    if (!ms || ms <= 0 || ms > 1000 * 60 * 60 * 24) {
      await interaction.reply({
        content: 'Invalid time format. Use numbers followed by s, m, h, or d.',
        ephemeral: true,
      });
      return;
    }
    await interaction.reply({
      content: `Reminder set! I will remind you in ${timeStr}.`,
      ephemeral: true,
    });
    const timeout = setTimeout(async () => {
      try {
        await interaction.followUp({
          content: `⏰ Reminder: ${message}`,
        });
      } catch (error) {
        console.error('Error sending reminder:', error);
      }
    }, ms);
    reminders.push({
      userId: interaction.user.id,
      channelId: interaction.channelId,
      time: Date.now() + ms,
      message,
      timeout,
    });
  } else if (sub === 'list') {
    const userReminders = reminders.filter((r) => r.userId === interaction.user.id);
    if (!userReminders.length) {
      await interaction.reply({
        content: 'You have no active reminders.',
        ephemeral: true,
      });
      return;
    }
    const lines = userReminders.map((r, idx) => {
      const remaining = Math.max(0, r.time - Date.now());
      const seconds = Math.ceil(remaining / 1000);
      return `${idx + 1}. ${r.message} - in ${seconds}s`;
    });
    await interaction.reply({
      content: 'Your reminders:\n' + lines.join('\n'),
      ephemeral: true,
    });
  }
}
