import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, CommandInteraction, GuildMember, Interaction } from "discord.js";
import runchecks from "../checks/runchecks";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("verify")
    .setDescription("Verifies your account and awards the required roles")
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("The input to echo back")
        .setRequired(true)
    ),
  async execute(interaction: Interaction) {
    const options = (interaction as any).options;
    const member = (interaction.member as GuildMember)

    let username = options.getString("username");
    const response = await runchecks(username!);

    let reply = "something went wrong";

    // parse response
    if (response) {
      const nick = response[0] as string;
      const roleid = response[1];
      const connectedDisc = response[2];

      let user = `${interaction.member?.user.username}#${interaction.member?.user.discriminator}`;

      if (user != connectedDisc) {
        // ERROR
        reply = `You dont own this profile. If this is incorrect, please try refreshing your socials on hypixel, and if THAT does not work, please contact the admins`;
      }
      // SUCCESS
      const role = member.guild.roles.cache.find(
        (i) => i.id == roleid
      );

      reply = `You have been verified and your nick has been changed to **${nick}**`;
      role != undefined ? member.roles.add(role) : reply = "Contact an admin and tell them that there is some issue with role ids"
      try {
      member.setNickname(nick)
      } catch {
        reply = "cannot change your username"
      }
    } else {
      // ERROR
      reply = "An error occured, please contact the admins";
    }
    await (interaction as CommandInteraction<CacheType>).reply({
      content: reply,
      ephemeral: true,
    });
    return // safety return
  },
};
