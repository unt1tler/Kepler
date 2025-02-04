import { EmbedBuilder, time, ButtonBuilder, ActionRowBuilder, ApplicationCommandType, ButtonStyle } from "discord.js";

export default {
 name: "uptime",
 description: "⌛ View Kepler bot uptime and past status",
 type: ApplicationCommandType.ChatInput,
 cooldown: 3000,
 dm_permission: true,
 usage: "/uptime",
 run: async (client, interaction, guildSettings) => {
  try {
   const embed = new EmbedBuilder()
    .setTitle("📈 Kepler's uptime")
    .setDescription(
     `**🚀 Date launched**: ${time(client.readyAt)}
     **⏱️ Started:** ${time(client.readyAt, "R")}
     
     **✨ Did you know?** From the time Kepler was launched it served \`${client.commandsRan}\` commands!
     `
    )
    .setTimestamp()
    .setColor(guildSettings?.embedColor || client.config.defaultColor)
    .setFooter({
     text: `Requested by ${interaction.member.user.globalName || interaction.member.user.username}`,
     iconURL: interaction.member.user.displayAvatarURL({
      size: 256,
     }),
    });

   if (client.config.url) {
    const action = new ActionRowBuilder().addComponents(
     new ButtonBuilder() // prettier
      .setLabel("Status page")
      .setStyle(ButtonStyle.Link)
      .setURL(`${client.config.url}/status`)
    );
    return interaction.followUp({ ephemeral: false, embeds: [embed], components: [action] });
   } else {
    return interaction.followUp({ ephemeral: false, embeds: [embed] });
   }
  } catch (err) {
   client.errorMessages.internalError(interaction, err);
  }
 },
};
