import {
  ApplicationCommandOptionType,
  ButtonStyle,
  ChatInputCommandInteraction,
  Collection,
  ComponentType,
  GuildMember,
  PermissionFlagsBits,
  TextBasedChannel
} from "discord.js";
import { Schema, model } from "mongoose";
import { Command, makeCustomId } from "../../handlers/interactions";

const schema = new Schema({
  guildId: { type: String, required: true },
  channelId: { type: String, required: true },
  type: { type: String, required: true }
});

const Model = model("channels", schema);

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

  components: [
    {
      name: "no",
      execute: async interaction => {
        return void interaction.update({ content: "Canceled", components: [] });
      }
    },
    {
      name: "yes",
      execute: async interaction => {
        await interaction.deferUpdate();
        const data = command.cache?.get(interaction.message.interaction?.id) as data;
        await Model.findByIdAndUpdate(data.documentId, data);
        await (interaction.guild?.channels.cache.get(data.channelId) as TextBasedChannel).send(
          `🎉 I will now send ${data.type} posts here.`
        );
        return void interaction.editReply({
          content: `
          ✅ <#${data.channelId}> is now setup for ${data.type} posts.`,
          components: []
        });
      }
    }
  ],
  cache: new Collection<string, data>(),
  execute: async (interaction: ChatInputCommandInteraction<"cached">) => {
    const type = interaction.options.getString("type", true) as blogOrUpdate;
    const channel = interaction.options.getChannel("channel", true) as TextBasedChannel;

    if (isInavlid(channel, interaction.guild.members.me))
      return void interaction.reply({
        content:
          "❌ Invalid channel\n\n" +
          "> The channel is not a text channel or I'm missing permissions\n\n" +
          "I need the following permissions:\n" +
          "```View Channel | Send Messages | Embed Links```",
        ephemeral: true
      });

    await interaction.deferReply({ ephemeral: true });
    const document = await Model.findOne({ guildId: interaction.guild.id, type });
    if (document) {
      if (document.channelId === channel.id) {
        return void interaction.editReply({
          content: `❌ This channel is already setup to receive ${type} posts`
        });
      }
      command.cache?.set(interaction.id, {
        guildId: interaction.guild.id,
        channelId: channel.id,
        type,
        documentId: document._id
      });
      return void interaction.editReply({
        content:
          `⚠ <#${document.channelId}> is already setup for ${type} posts. ` +
          `Do you want to change it to <#${channel.id}>?`,
        components: [
          {
            type: ComponentType.ActionRow,
            components: [
              {
                type: ComponentType.Button,
                style: ButtonStyle.Danger,
                label: "Yes, change it",
                customId: makeCustomId(command, "yes")
              },
              {
                type: ComponentType.Button,
                style: ButtonStyle.Primary,
                label: "No, keep it",
                customId: makeCustomId(command, "no")
              }
            ]
          }
        ]
      });
    } else {
      const newDocument = new Model({
        guildId: interaction.guild.id,
        channelId: channel.id,
        type
      });
      await newDocument.save();
      channel.send(`🎉 I will now send ${type} posts here.`);
      return void interaction.editReply({
        content: `✅ <#${channel.id}> is now setup for ${type} posts.`
      });
    }
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

type blogOrUpdate = "blog" | "update";
interface data {
  documentId: string;
  guildId: string;
  channelId: string;
  type: blogOrUpdate;
}
