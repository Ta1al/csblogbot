import { Interaction, CommandInteraction, MessageComponentInteraction } from "discord.js";
import {
  ApplicationCommandType as CommandType,
  RESTPostAPIApplicationCommandsJSONBody
} from "discord-api-types/v10";
import handleChatInput from "./chatInput";
import handleComponent from "./component";
import handleUserContext from "./user";
import handleMessageContext from "./message";

export default async function handleInteraction(interaction: Interaction) {
  try {
    if (interaction.isChatInputCommand()) return handleChatInput(interaction);
    if (interaction.isMessageComponent()) return handleComponent(interaction);
    if (interaction.isUserContextMenuCommand()) return handleUserContext(interaction);
    if (interaction.isMessageContextMenuCommand()) return handleMessageContext(interaction);
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

export function makeCustomId(command: Command, id: string): string {
  const types = {
    1: "chatInput",
    2: "user",
    3: "message"
  };

  return `${types[command.data.type ?? CommandType.ChatInput]}:${command.data.name}:${id}`;
}
