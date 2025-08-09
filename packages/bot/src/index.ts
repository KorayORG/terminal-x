import 'dotenv/config';
import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import { data as pingData, execute as pingExecute } from './commands/ping';

import { data as modData, execute as modExecute } from './commands/mod';
import pino from 'pino';
import { checkMessage } from './automod';

import pino from 'pino';


const logger = pino();
const token = process.env.DISCORD_BOT_TOKEN as string;
const clientId = process.env.DISCORD_CLIENT_ID as string;


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
const client = new Client({ intents: [GatewayIntentBits.Guilds] });


client.once('ready', () => {
  logger.info(`Logged in as ${client.user?.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === 'ping') {
    await pingExecute(interaction);
  }

  if (interaction.commandName === 'mod') {
    await modExecute(interaction);
  }
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  const result = checkMessage(message.content);
  if (result) {
    await message.delete().catch(() => undefined);
    await fetch(`${process.env.API_URL}/guilds/${message.guildId}/cases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        actorId: 'automod',
        targetId: message.author.id,
        action: 'DELETE_MSG',
        reason: result,
      }),
    }).catch(() => undefined);
  }

});

async function main() {
  const rest = new REST({ version: '10' }).setToken(token);
  await rest.put(Routes.applicationCommands(clientId), {

    body: [pingData.toJSON(), modData.toJSON()],

  });
  await client.login(token);
}

main().catch((err) => logger.error(err));
