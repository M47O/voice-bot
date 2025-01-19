import {
  REST,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
} from "discord.js";
import config from "./config";
import fs from "fs";
import path from "path";
import Command from "./types/commands";

async function deployCommands() {
  const commands: Array<RESTPostAPIChatInputApplicationCommandsJSONBody> = [];

  const commandsPath = path.join(__dirname, "commands");
  const commandFiles = fs
    .readdirSync(commandsPath, {
      recursive: true,
    })
    .filter((file) => typeof file === "string" && file.endsWith(".command.js"));

  for (const file of commandFiles) {
    if (typeof file !== "string") {
      throw new Error("[ERROR] Command deployment script consumed a Buffer.");
    }

    const filePath = path.join(commandsPath, file);
    await getCommandData(filePath);
  }

  async function getCommandData(filePath: string) {
    const module = await import(filePath);
    const command: Command = module.default;
    commands.push(command.data.toJSON());
  }

  const rest = new REST().setToken(config.DISCORD_TOKEN);

  try {
    console.log(
      `Registering ${commands.length} application ${
        commands.length > 1 ? "commands" : "command"
      } with Discord.`
    );
    await rest.put(
      Routes.applicationGuildCommands(config.CLIENT_ID, config.GUILD_ID),
      { body: commands }
    );
    console.log("All commands successfully registered.");
  } catch (error) {
    console.error(error);
  }
}

deployCommands();
