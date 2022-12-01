import { getBlogPosts } from "csblogscraper";
import { Schema, model } from "mongoose";
import { sendToChannels } from ".";
import blogCommand from "../../commands/chatInput/blog";
import { Client } from "discord.js";
const BlogPostSchema = new Schema({
  postId: String
});

const BlogPostDocument = model("BlogPost", BlogPostSchema);
export default function handleBlogPost(client: Client) {
  setInterval(async () => {
    const posts = await getBlogPosts();
    if (!posts) return;
    const doc = await BlogPostDocument.find();
    if (!doc || !doc.length) {
      await BlogPostDocument.create({ postId: posts[0].link.split("/").pop() });
      return;
    }
    if (doc[0].postId !== posts[0].link.split("/").pop()) {
      blogCommand.cache?.set(1, posts[0]);
      setTimeout(() => blogCommand.cache?.delete(1), 60e4);
      await BlogPostDocument.updateOne(
        { postId: doc[0].id },
        { postId: posts[0].link.split("/").pop() }
      );
      return sendToChannels(client, posts[0], "blog");
    }
  }, 360e4); // 1 hour
}
