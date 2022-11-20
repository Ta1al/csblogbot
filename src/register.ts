import "dotenv/config";
import { REST, Routes } from "discord.js";
import { RESTPutAPIApplicationCommandsJSONBody as Commands } from "discord-api-types/v10";
import fs from "fs";
import { Command } from "./handlers/interactions/ChatInput";

const commands: Commands = [];
fs.readdirSync("./commands/").forEach(folder => {
  fs.readdirSync(`./commands/${folder}`).forEach(async file => {
    const command = (await import(`../commands/${folder}/${file}`)) as Command;
    commands.push(command.data);
  });
});

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
      `Successfully refreshed application commands${GUILD_ID ? ` for guild ${GUILD_ID}` : ""}`,
      `Total: ${commands.length}`
    );
  } catch (error) {
    console.error(error);
  }
})();
