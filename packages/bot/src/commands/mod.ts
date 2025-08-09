import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} from 'discord.js';
import { CaseActionSchema } from '@terminal-x/shared';

export const data = new SlashCommandBuilder()
  .setName('mod')
  .setDescription('Moderation commands')
  .addSubcommand((sub) =>
    sub
      .setName('warn')
      .setDescription('Warn a user')
      .addUserOption((opt) =>
        opt.setName('user').setDescription('User').setRequired(true)
      )
      .addStringOption((opt) =>
        opt.setName('reason').setDescription('Reason').setRequired(false)
      )
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);

export async function execute(interaction: ChatInputCommandInteraction) {
  const sub = interaction.options.getSubcommand();
  if (sub === 'warn') {
    const user = interaction.options.getUser('user', true);
    const reason = interaction.options.getString('reason') ?? undefined;
    await fetch(`${process.env.API_URL}/guilds/${interaction.guildId}/cases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        actorId: interaction.user.id,
        targetId: user.id,
        action: CaseActionSchema.Enum.WARN,
        reason,
      }),
    }).catch(() => undefined);
    await interaction.reply({
      content: `Warned ${user.tag}${reason ? ` for ${reason}` : ''}`,
      ephemeral: true,
    });
  }
}
