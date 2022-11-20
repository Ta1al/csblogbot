import { ChatInputCommandInteraction, CommandInteraction } from "discord.js";
import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10";

export default async function handleChatInput(interaction: ChatInputCommandInteraction) {
  const command = (await import(`../../commands/chatInput/${interaction.commandName}`))
    .default as Command;
  return command.execute(interaction);
}

export interface Command {
  data: RESTPostAPIApplicationCommandsJSONBody;
  execute(interaction: CommandInteraction): Promise<void>;
}
