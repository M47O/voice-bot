import {
  SlashCommandBuilder,
  CommandInteraction,
  ChatInputCommandInteraction,
} from "discord.js";

export default interface Command {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute: (interaction: CommandInteraction) => void;
}

export interface ChatInputCommand extends Command {
  execute: (interaction: ChatInputCommandInteraction) => void;
}
