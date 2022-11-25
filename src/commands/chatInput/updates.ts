import { Command } from "../../handlers/interactions";
import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  ComponentType,
  EmbedBuilder,
  MessageComponentInteraction
} from "discord.js";
import { getUpdatePosts, Post } from "csblogscraper";
import { makeCustomId } from "../../handlers/interactions/index";

const command: Command = {
  data: {
    name: "updates",
    description: "Get the latest update posts from CSGO",
    options: [
      {
        type: ApplicationCommandOptionType.Number,
        name: "page",
        description: "Page number"
      }
    ]
  },

  components: [
    {
      name: "updates",
      hasPermission: (interaction: MessageComponentInteraction) =>
        interaction.user.id === interaction.message.interaction?.user.id,
      execute: async (interaction: MessageComponentInteraction) => {
        if (!interaction.isSelectMenu()) return;
        const page = parseInt(interaction.customId.split(":")[3]),
          posts = await getUpdatePosts(page),
          embeds = [makeEmbed(posts[parseInt(interaction.values[0])])],
          components = [makeComponent(page, posts)];
        return void (await interaction.update({ embeds, components }));
      }
    }
  ],

  execute: async (interaction: ChatInputCommandInteraction) => {
    const page = interaction.options.getNumber("page") || 0,
      posts = await getUpdatePosts(page).catch(() => []);
    if (!posts || !posts.length) return void interaction.reply("No posts found");

    const embeds = [makeEmbed(posts[0])],
      components = [makeComponent(page, posts)];
    return void interaction.reply({ embeds, components });
  }
};

export default command;

function makeComponent(page: number, posts: Post[]) {
  return {
    type: ComponentType.ActionRow,
    components: [
      {
        type: ComponentType.SelectMenu as const, // explain
        customId: makeCustomId(command, `updates:${page}`),
        options: posts.map((post, i) => ({
          label: post.title,
          description: post.date.toDateString(),
          value: `${i}`
        }))
      }
    ]
  };
}

function makeEmbed(post: Post): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(post.title)
    .setURL(post.link)
    .setTimestamp(post.date)
    .setDescription(post.content.slice(0, 4096))
    .setImage(post.image)
    .setColor("#2f3136");
}
