import "dotenv/config";
import { REST, Routes } from "discord.js";
import fs from "fs/promises";

(async () => {
  const folders = await fs.readdir(`${__dirname}/commands/`),
    filePaths = (
      await Promise.all(
        folders.map(async folder =>
          (
            await fs.readdir(`${__dirname}/commands/${folder}/`)
          ).map(file => `${folder}/${file.split(".")[0]}`)
        )
      )
    ).flat(),
    commands = await Promise.all(
      filePaths.map(async file => {
        const command = (await import(`./commands/${file}`)).default;
        console.log(file, command);
        return command.data;
      })
    );

  await registerCommands(commands);
})();

async function registerCommands(commands: unknown[]) {
  const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;
  if (!TOKEN) throw new Error("TOKEN is not defined in the environment");
  if (!CLIENT_ID) throw new Error("CLIENT_ID is not defined in the environment");

  const rest = new REST({ version: "10" }).setToken(TOKEN);

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
}
