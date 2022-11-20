import { Interaction, CommandInteraction } from "discord.js";
import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10";
import handleChatInput from "./ChatInput";


export default async function handleInteraction(interaction: Interaction) {
  try {
    if (interaction.isChatInputCommand()) return handleChatInput(interaction);
    
  } catch (error) {
    console.error(error);
  }
}

export interface Command {
  data: RESTPostAPIApplicationCommandsJSONBody;
  execute(interaction: CommandInteraction): Promise<void>;
}