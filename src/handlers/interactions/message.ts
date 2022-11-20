import { MessageContextMenuCommandInteraction as MessageContextMenu } from "discord.js";
import { Command } from ".";


export default async function handleMessageContext(interaction: MessageContextMenu) {
  const command = (await import(`../../commands/message/${interaction.commandName}`))
    .default as Command;
  return command.execute(interaction);
}