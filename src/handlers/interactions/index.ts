import { Interaction, CommandInteraction, MessageComponentInteraction, Collection } from "discord.js";
import {
  ApplicationCommandType as CommandType,
  RESTPostAPIApplicationCommandsJSONBody
} from "discord-api-types/v10";
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
  cache?: Collection<unknown, unknown>;
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
