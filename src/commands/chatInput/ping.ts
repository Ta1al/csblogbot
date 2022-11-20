import { ChatInputCommandInteraction } from "discord.js";
import { Command } from "../../handlers/interactions/ChatInput";

export const command: Command = {
  data: {
    name: "ping",
    description: "Replies with Pong!"
  },

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    return void await interaction.reply("Pong!");
  }
};
