import { UserContextMenuCommandInteraction as UserContextMenu } from "discord.js";
import { Command } from ".";

export default async function handleUserContext(interaction: UserContextMenu) {
  const command = (await import(`../../commands/user/${interaction.commandName}`))
    .default as Command;
  return command.execute(interaction);
}
