import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds], allowedMentions: { parse: [] } });

client.once("ready", () => {
  console.log("Ready!");
});

client.login(process.env.TOKEN);
