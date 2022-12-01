import handleBlogPost from "./blog";
import handleUpdatePost from "./update";
import { Post } from "csblogscraper";
import { Model } from "../../commands/chatInput/setup";
import { Client, TextBasedChannel } from "discord.js";
import { makeEmbeds } from "../../commands/chatInput/blog";
export default function handleNewPost(client: Client) {
  handleUpdatePost(client);
  handleBlogPost(client);
}

export async function sendToChannels(client: Client, post: Post, type: "blog" | "update") {
  const docs = await Model.find({ type });
  if (!docs || !docs.length) return;
  for (const doc of docs) {
    const channel = await client.channels.fetch(doc.channelId) as TextBasedChannel;
    if (!channel) continue;
    channel.send({ embeds: makeEmbeds(post) });
  }
  return post + type;
}