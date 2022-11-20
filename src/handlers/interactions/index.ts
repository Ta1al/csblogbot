import { Interaction, CommandInteraction, MessageComponentInteraction } from "discord.js";
import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10";
import handleChatInput from "./chatInput";
import handleComponent from "./component";


export default async function handleInteraction(interaction: Interaction) {
  try {
    if (interaction.isChatInputCommand()) return handleChatInput(interaction);
    if (interaction.isMessageComponent()) return handleComponent(interaction);
  } catch (error) {
    console.error(error);
  }
}

export interface Command {
  data: RESTPostAPIApplicationCommandsJSONBody;
  components?: Component[];
  execute(interaction: CommandInteraction): Promise<void>;
}

interface Component {
  name: string;
  hasPermission?(interaction: MessageComponentInteraction): boolean;
  execute: (interaction: MessageComponentInteraction) => Promise<void>;
}