import 'dotenv/config';
import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import { data as pingData, execute as pingExecute } from './commands/ping';
import pino from 'pino';

const logger = pino();
const token = process.env.DISCORD_BOT_TOKEN as string;
const clientId = process.env.DISCORD_CLIENT_ID as string;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
  logger.info(`Logged in as ${client.user?.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === 'ping') {
    await pingExecute(interaction);
  }
});

async function main() {
  const rest = new REST({ version: '10' }).setToken(token);
  await rest.put(Routes.applicationCommands(clientId), {
    body: [pingData.toJSON()],
  });
  await client.login(token);
}

main().catch((err) => logger.error(err));
