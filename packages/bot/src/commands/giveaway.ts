import { SlashCommandBuilder, ChatInputCommandInteraction, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } from 'discord.js';

// In-memory store for giveaways
const giveaways: Record<string, { prize: string; winners: number; entries: Set<string>; ended: boolean }> = {};

export const data = new SlashCommandBuilder()
  .setName('giveaway')
  .setDescription('Manage giveaways')
  .addSubcommand(sub =>
    sub
      .setName('start')
      .setDescription('Start a giveaway')
      .addStringOption(opt => opt.setName('prize').setDescription('Prize').setRequired(true))
      .addIntegerOption(opt => opt.setName('winners').setDescription('Number of winners').setRequired(false))
      .addIntegerOption(opt => opt.setName('duration').setDescription('Duration in minutes').setRequired(false))
  )
  .addSubcommand(sub =>
    sub
      .setName('end')
      .setDescription('End a giveaway')
      .addStringOption(opt => opt.setName('message_id').setDescription('Giveaway message id').setRequired(true))
  )
  .addSubcommand(sub =>
    sub
      .setName('reroll')
      .setDescription('Reroll winners')
      .addStringOption(opt => opt.setName('message_id').setDescription('Giveaway message id').setRequired(true))
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const sub = interaction.options.getSubcommand();
  if (sub === 'start') {
    const prize = interaction.options.getString('prize', true);
    const winners = interaction.options.getInteger('winners') ?? 1;
    const duration = interaction.options.getInteger('duration') ?? 1;

    const joinButton = new ButtonBuilder()
      .setCustomId('join_giveaway')
      .setLabel('Join')
      .setStyle(ButtonStyle.Primary);
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(joinButton);

    const message = await interaction.reply({
      content: `\u{1F389} Giveaway: **${prize}**! Click Join to participate. Winners: ${winners}. Duration: ${duration} min.`,
      components: [row],
      fetchReply: true,
    });

    giveaways[message.id] = { prize, winners, entries: new Set(), ended: false };

    const filter = (i: any) => i.customId === 'join_giveaway';
    const collector = (message as any).createMessageComponentCollector({ filter, time: duration * 60 * 1000 });

    collector.on('collect', async i => {
      giveaways[message.id].entries.add(i.user.id);
      await i.reply({ content: 'You have entered the giveaway!', ephemeral: true });
    });

    collector.on('end', async () => {
      const g = giveaways[message.id];
      if (!g || g.ended) return;
      g.ended = true;
      const entriesArray = Array.from(g.entries);
      if (entriesArray.length === 0) {
        await interaction.followUp({ content: 'No participants. Giveaway cancelled.', components: [] });
        return;
      }
      const winnersList: string[] = [];
      for (let i = 0; i < Math.min(g.winners, entriesArray.length); i++) {
        const randIndex = Math.floor(Math.random() * entriesArray.length);
        winnersList.push(`<@${entriesArray.splice(randIndex, 1)[0]}>`);
      }
      await interaction.followUp({ content: `\u{1F389} Giveaway ended! Prize: **${g.prize}**. Winners: ${winnersList.join(', ')}`, components: [] });
    });
  } else if (sub === 'end' || sub === 'reroll') {
    const messageId = interaction.options.getString('message_id', true);
    const g = giveaways[messageId];
    if (!g) {
      await interaction.reply({ content: 'Giveaway not found.', ephemeral: true });
      return;
    }
    if (g.entries.size === 0) {
      await interaction.reply({ content: 'No participants in this giveaway.', ephemeral: true });
      return;
    }
    const entriesArray = Array.from(g.entries);
    const winnersList: string[] = [];
    for (let i = 0; i < Math.min(g.winners, entriesArray.length); i++) {
      const randIndex = Math.floor(Math.random() * entriesArray.length);
      winnersList.push(`<@${entriesArray.splice(randIndex, 1)[0]}>`);
    }
    g.ended = true;
    await interaction.reply({ content: `\u{1F389} Giveaway ended! Prize: **${g.prize}**. Winners: ${winnersList.join(', ')}`, components: [] });
  } else {
    await interaction.reply({ content: 'Unknown subcommand.', ephemeral: true });
  }
}
