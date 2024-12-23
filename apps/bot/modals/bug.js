import { formatDuration } from "@kepler/util/functions/util";
import { WebhookClient, EmbedBuilder } from "discord.js";

// Define timeout map to handle cooldowns
const timeout = new Map();

export default {
 id: "bug",
 run: async (client, interaction) => {
  try {
   await interaction.deferReply({ ephemeral: true });

   const bug = interaction.fields.getTextInputValue("bug");

   if (bug.length < 5 || bug.length > 500) {
    const embed = new EmbedBuilder()
     .setTitle("‼️ The bug must be between 5 and 500 characters!")
     .setDescription("Please make sure the bug is between 5 and 500 characters!")
     .setColor("#EF4444")
     .setTimestamp()
     .setFooter({
      text: `Suggested by ${interaction.member.user.globalName || interaction.member.user.username}`,
      iconURL: interaction.member.user.displayAvatarURL({
       size: 256,
      }),
     });

    return interaction.followUp({ ephemeral: true, embeds: [embed] });
   }

   const key = `${interaction.member.user.id}-suggest`;

   if (timeout.has(key) && timeout.get(key).time > Date.now()) {
    const { time } = timeout.get(key);
    const duration = formatDuration(time - Date.now());

    const embed = new EmbedBuilder()
     .setTitle("‼️ You are on cooldown!")
     .setDescription(`You are on cooldown for \`${duration}\`! Please wait before suggesting again!`)
     .setColor("#EF4444")
     .setTimestamp()
     .setFooter({
      text: `Suggested by ${interaction.member.user.globalName || interaction.member.user.username}`,
      iconURL: interaction.member.user.displayAvatarURL({
       size: 256,
      }),
     });

    return interaction.followUp({ ephemeral: true, embeds: [embed] });
   }

   timeout.set(key, { time: Date.now() + 60000 });
   setTimeout(() => {
    timeout.delete(key);
   }, 60000);

   const webhookUrl = "https://discord.com/api/webhooks/1235097165374947480/M0AG5ugVrFGrux4b66WbAXlMZJzZfjIqIjLHgxZfxigR8g92WFLSxXmwToaKA6cLw2en";
   const webhookClient = new WebhookClient({ url: webhookUrl });

   const embed = new EmbedBuilder()
    .setTitle("New bug!")
    .setDescription(`**bug**: ${bug}`)
    .setColor("#3B82F6")
    .setTimestamp()
    .setFooter({
     text: `Suggested by ${interaction.member.user.globalName || interaction.member.user.username}`,
     iconURL: interaction.member.user.displayAvatarURL({
      size: 256,
     }),
    });

   await webhookClient.send({ embeds: [embed] });

   const successEmbed = new EmbedBuilder()
    .setTitle("Thank you for reporting the bug!")
    .setDescription("The bug has been reported successfully!")
    .setColor("#3B82F6")
    .setTimestamp()
    .setFooter({
     text: `Bug reported by ${interaction.member.user.globalName || interaction.member.user.username}`,
     iconURL: interaction.member.user.displayAvatarURL({
      size: 256,
     }),
    });

   return interaction.followUp({ ephemeral: true, embeds: [successEmbed] });
  } catch (error) {
   console.error("An error occurred:", error);
   return interaction.followUp({ content: "An error occurred while reporting the bug.", ephemeral: true });
  }
 },
};
