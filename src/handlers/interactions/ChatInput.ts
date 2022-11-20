import { ChatInputCommandInteraction } from "discord.js";
import { Command } from ".";

export default async function handleChatInput(interaction: ChatInputCommandInteraction) {
  const command = (await import(`../../commands/chatInput/${interaction.commandName}`))
    .default as Command;
  return command.execute(interaction);
}
