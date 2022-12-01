import "dotenv/config";
import { ActivityType, Client, GatewayIntentBits } from "discord.js";
import handleInteraction from "./handlers/interactions";
import { connect } from "mongoose";
import handleNewPost from "./handlers/posts";

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  allowedMentions: { parse: [] },
  presence: {
    activities: [{ name: "CSGO Updates", type: ActivityType.Listening }],
    status: "online"
  }
});

client.once("ready", client => {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not defined");
  connect(process.env.MONGO_URI).then(() => console.log("Connected to MongoDB"));
  handleNewPost();
  console.log("Ready as", client.user?.tag);
});

client.on("interactionCreate", handleInteraction);

client.login(process.env.TOKEN);
