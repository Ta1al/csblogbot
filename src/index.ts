import "dotenv/config";
import { ActivityType, Client, GatewayIntentBits } from "discord.js";
import handleInteraction from "./handlers/interactions";

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  allowedMentions: { parse: [] },
  presence: {
    activities: [{ name: "CSGO Updates", type: ActivityType.Listening }],
    status: "online"
  }
});

client.once("ready", () => console.log("Ready!"));

client.on("interactionCreate", handleInteraction);

client.login(process.env.TOKEN);
