import { CacheType, Client, GatewayIntentBits, Interaction } from "discord.js";
import { Player } from "discord-player";
import config from "./config";
import path from "path";
import fs from "fs";
import Command from "./types/commands";
import { getVoiceConnection } from "@discordjs/voice";

class CustomClient extends Client {
  commands: Array<Command> = [];
  player!: Player;
}
export const client = new CustomClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath, {
    recursive: true,
  })
  .filter((file) => typeof file === "string" && file.endsWith(".command.js"));

commandFiles.forEach((modulePath) => {
  if (typeof modulePath === "string") {
    const module = require(path.join(commandsPath, modulePath));
    client.commands.push(module.default);
  }
});

let lastInteraction: Interaction<CacheType> | null = null;
const { GUILD_ID } = config;

client.once("ready", () => {
  console.log("Discord bot ready!");

  setInterval(() => {
    const voiceConnection = getVoiceConnection(GUILD_ID);
    if (lastInteraction && voiceConnection) {
      const timeElapsed = Date.now() - lastInteraction.createdAt.getTime();
      console.log(timeElapsed);
      // Five minutes
      if (timeElapsed > 300000) {
        voiceConnection.destroy();
      }
    }
  }, 30000);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  client.commands
    .find((command) => command.data.name === commandName)
    ?.execute(interaction);

  lastInteraction = interaction;
});

client.login(config.DISCORD_TOKEN);
