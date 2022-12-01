import handleBlogPost from "./blog";
import handleUpdatePost from "./update";
import { Post } from "csblogscraper";

export default function handleNewPost() {
  handleUpdatePost();
  handleBlogPost();
}

export function sendToChannels(post: Post, type: "blog" | "update") {
  return post + type;
}