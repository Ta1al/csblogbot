import { ChatInputCommandInteraction } from "discord.js";
import { Command } from "../../handlers/interactions";

export default {
  data: {
    description: "Client WebSocket ping"
  },

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    return void (await interaction.reply({
      content: `${interaction.client.ws.ping}ms`,
      ephemeral: true
    }));
  }
} as Command;
