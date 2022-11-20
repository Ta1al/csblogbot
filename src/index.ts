import "dotenv/config";
import { ActivityType, Client, GatewayIntentBits } from "discord.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  allowedMentions: { parse: [] },
  presence: { activities: [{ name: "CSGO Blog", type: ActivityType.Watching }], status: "online" }
});

client.once("ready", () => {
  console.log("Ready!");
});

client.login(process.env.TOKEN);
