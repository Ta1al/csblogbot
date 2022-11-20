import { Interaction } from "discord.js";
import handleChatInput from "./ChatInput";


export default async function handleInteraction(interaction: Interaction) {
  try {
    if (interaction.isChatInputCommand()) return handleChatInput(interaction);
    
  } catch (error) {
    console.error(error);
  }
}