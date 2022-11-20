import { Command } from "../../handlers/interactions";
import { ChatInputCommandInteraction } from "discord.js";

export default {
  data: {
    description: "Get the latest posts from CSGO Blog"
  },

  execute: async (interaction: ChatInputCommandInteraction) => {
    return void (await interaction.reply({
      content: "This command is not yet implemented",
      ephemeral: true
    }));
  }
} as Command;
