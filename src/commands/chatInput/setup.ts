import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { Command } from "../../handlers/interactions";

const command: Command = {
  data: {
    name: "setup",
    description: "Setup a channel to receive updates",
    options: [
      {
        name: "channel",
        description: "The channel to receive updates",
        type: ApplicationCommandOptionType.Channel,
        required: true
      },
      {
        name: "type",
        description: "The type of updates to receive",
        type: ApplicationCommandOptionType.String,
        choices: [
          {
            name: "Blog Posts",
            value: "blog"
          },
          {
            name: "Update Posts",
            value: "update"
          }
        ],
        required: true
      }
    ]
  },

  execute: async (interaction: ChatInputCommandInteraction) => {
    return void interaction.reply("TODO");
  }
};

export default command;
