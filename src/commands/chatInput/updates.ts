import { Command } from "../../handlers/interactions";
import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageComponentInteraction,
  StringSelectMenuBuilder
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
        description: "Page number",
        min_value: 1
      }
    ]
  },

  components: [
    {
      name: "updates",
      hasPermission: (interaction: MessageComponentInteraction) =>
        interaction.user.id === interaction.message.interaction?.user.id,
      execute: async (interaction: MessageComponentInteraction) => {
        if (!interaction.isStringSelectMenu()) return;
        const page = parseInt(interaction.customId.split(":")[3]),
          posts = await getPosts(page),
          selectedPost = parseInt(interaction.values[0]),
          embeds = makeEmbeds(posts[selectedPost]),
          components = makeComponents(page, posts, selectedPost);
        return void (await interaction.update({ embeds, components }));
      }
    }
  ],

  execute: async (interaction: ChatInputCommandInteraction) => {
    const page = interaction.options.getNumber("page") || 1,
      posts = await getPosts(page);
    if (!posts || !posts.length) return void interaction.reply("No posts found");

    const embeds = makeEmbeds(posts[0]),
      components = makeComponents(page, posts);
    return void interaction.reply({ embeds, components });
  }
};

export default command;

async function getPosts(page: number) {
  let posts = command.cache?.get(page) as Post[];
  if (!posts) {
    posts = await getUpdatePosts(page).catch(() => []);
    updateCache(page, posts);
  }
  return posts;
}

function updateCache(page: number, posts: Post[]) {
  command.cache?.set(page, posts);
  setTimeout(() => command.cache?.delete(page), 60e4);
}

function makeComponents(
  page: number,
  posts: Post[],
  selectedPost = 0
): ActionRowBuilder<StringSelectMenuBuilder | ButtonBuilder>[] {
  return [
    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(makeCustomId(command, `updates:${page}`))
        .setOptions(
          posts.map((post, i) => ({
            label: post.title,
            description: post.date.toDateString(),
            value: `${i}`
          }))
        )
    ),
    new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setURL(posts[selectedPost].link)
        .setLabel("Link")
    )
  ];
}

function makeEmbeds(post: Post): EmbedBuilder[] {
  return [
    new EmbedBuilder()
      .setTitle(post.title)
      .setURL(post.link)
      .setFooter({ text: post.date.toDateString() })
      .setDescription(post.content.slice(0, 4096))
      .setColor("#2f3136")
  ];
}
