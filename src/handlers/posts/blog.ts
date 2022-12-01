import { getBlogPosts } from "csblogscraper";
import { Schema, model } from "mongoose";
import { sendToChannels } from ".";
import blogCommand from "../../commands/chatInput/blog";
const BlogPostSchema = new Schema({
  postId: String
});

const BlogPostDocument = model("BlogPost", BlogPostSchema);
export default function handleBlogPost() {
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
      return sendToChannels(posts[0], "blog");
    }
  }, 360e4); // 1 hour
}
