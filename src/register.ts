import "dotenv/config";
import { REST, Routes } from "discord.js";

const commands = [
  {
    name: "ping",
    description: "Replies with Pong!"
  }
];

const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;
if (!TOKEN) throw new Error("TOKEN is not defined in the environment");
if (!CLIENT_ID) throw new Error("CLIENT_ID is not defined in the environment");

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    console.log("Refreshing Application Commands.");

    if (GUILD_ID)
      rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    else await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

    console.log(
      `Successfully refreshed application commands${GUILD_ID ? ` for guild ${GUILD_ID}` : ""}`
    );
  } catch (error) {
    console.error(error);
  }
})();
