import { Collection, Client, Intents, Interaction } from "discord.js";
import fs from "node:fs";

const client: Client<boolean> | any = new Client({
  intents: [Intents.FLAGS.GUILDS],
});

require("dotenv").config();

require("./commands");

const TOKEN = process.env.TOKEN;

client.on("ready", () => {
  console.log(`Logged in as ${client.user!.tag}!`);
  client.user.setPresence({
    activities: [
      {
        name: "over the guild",
        type: "WATCHING",
      },
    ],
    status: "idle",
  });
});

client.commands = new Collection();

const commandFiles = fs
  .readdirSync("./dist/commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.on("interactionCreate", async (interaction: Interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.login(TOKEN);
