import { MessageComponentInteraction } from "discord.js";
import { Command } from ".";

export default async function handleComponent(interaction: MessageComponentInteraction) {
  const [commandType, commandName, componentName] = interaction.customId.split(":");
  const command: Command = (
    await import(`../../commands/${commandType}/${commandName}`).catch(() => null)
  )?.default;

  if (!command || !command.components) return;
  const component = command.components.find(component => component.name === componentName);
  if (!component) return;

  if (component.hasPermission && !component.hasPermission(interaction))
    return void (await interaction.reply({
      content: "x You do not have permission to use this component.",
      ephemeral: true
    }));

  return component.execute(interaction);
}
