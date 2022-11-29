/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  GuildMember,
  PermissionFlagsBits,
  TextBasedChannel
} from "discord.js";
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

  execute: async (interaction: ChatInputCommandInteraction<"cached">) => {
    const type = interaction.options.getString("type", true) as "blog" | "update";
    const channel = interaction.options.getChannel("channel", true) as TextBasedChannel;

    if (isInavlid(channel, interaction.guild.members.me))
      return void interaction.reply({
        content:
          "❌ Invalid channel\n\n" +
          "> The channel is not a text channel or I'm missing permissions" +
          "(`View Channel` or `Send Message`)",
        ephemeral: true
      });

    return void interaction.reply({ content: `${type} ${channel}`, ephemeral: true });
  }
};

export default command;

function isInavlid(channel: TextBasedChannel, member: GuildMember | null) {
  if (!channel.isTextBased() || channel.isDMBased()) return true;
  if (
    !member
      ?.permissionsIn(channel)
      .has(PermissionFlagsBits.SendMessages | PermissionFlagsBits.ViewChannel)
  )
    return true;
  return false;
}
