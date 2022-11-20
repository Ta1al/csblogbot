import { Interaction } from "discord.js";


export default async function handleInteraction(interaction: Interaction) {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "ping") {
    interaction.reply("Pong!");
  }
}