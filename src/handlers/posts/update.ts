import { getUpdatePosts } from "csblogscraper";
import { Client } from "discord.js";
import { Schema, model } from "mongoose";
import { sendToChannels } from ".";
import updateCommand from "../../commands/chatInput/updates";
const UpdatePostSchema = new Schema({
  postId: String
});

const UpdatePostDocument = model("UpdatePost", UpdatePostSchema);
export default function handleUpdatePost(client: Client) {
  setInterval(async () => {
    const posts = await getUpdatePosts();
    if (!posts) return;
    const doc = await UpdatePostDocument.find();
    if (!doc || !doc.length) {
      await UpdatePostDocument.create({ postId: posts[0].link.split("/").pop() });
      return;
    }
    if (doc[0].postId !== posts[0].link.split("/").pop()) {
      updateCommand.cache?.set(1, posts[0]);
      setTimeout(() => updateCommand.cache?.delete(1), 60e4);
      await UpdatePostDocument.updateOne(
        { postId: doc[0].id },
        { postId: posts[0].link.split("/").pop() }
      );
      return sendToChannels(client, posts[0], "update");
    }
  }, 360e4); // 1 hour
}
