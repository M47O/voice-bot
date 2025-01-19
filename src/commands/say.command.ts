import { GuildMember, SlashCommandBuilder } from "discord.js";
import Command, { ChatInputCommand } from "../types/commands";
import { joinVoiceChannel } from "@discordjs/voice";

const ping: ChatInputCommand = {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription(
      "Joins your voice channel if not already in it and speaks the provided prompt"
    )
    .addStringOption((option) =>
      option
        .setName("speak")
        .setDescription("What would you like me to say?")
        .setRequired(true)
    ),

  execute: async (interaction) => {
    const option = interaction.options.getString("say");
    const member = interaction.member as GuildMember;
    const channel = member.voice.channel;
    if (channel) {
      const voiceConnection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      });

      await interaction.reply({
        content: `Joining ${channel.name}`,
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "You must be in a channel to use this command!",
        ephemeral: true,
      });
    }

    // await interaction.reply(
    //   member.voice.channel ? member.voice.channel.id : "No channel."
    // );
  },
};

export default ping;
