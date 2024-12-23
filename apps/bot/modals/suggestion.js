import prismaClient from "@kepler/database";
import { formatDuration } from "@kepler/util/functions/util";
import { WebhookClient, EmbedBuilder } from "discord.js";

const timeout = new Map();

export default {
 id: "suggestion",
 run: async (client, interaction) => {
  try {
   await interaction.deferReply({ ephemeral: true });

   const suggestion = interaction.fields.getTextInputValue("suggestion");

   if (suggestion.length < 5 || suggestion.length > 500) {
    const embed = new EmbedBuilder()
     .setTitle("‼️ Your suggestion must be between 5 and 500 characters!")
     .setDescription("Please make sure your suggestion is between 5 and 500 characters!")
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
    .setTitle("📝 New Suggestion!")
    .setDescription(`**Suggestion**: ${suggestion}`)
    .setColor("#3B82F6")
    .setTimestamp()
    .setFooter({
     text: `Suggested by ${interaction.member.user.globalName || interaction.member.user.username}`,
     iconURL: interaction.member.user.displayAvatarURL({
      size: 256,
     }),
    });

   await webhookClient.send({ embeds: [embed] });

   await prismaClient.suggestions.create({
    data: {
     message: suggestion,
     userId: interaction.member.user.id,
     guildId: interaction.guild.id,
    },
   });

   const successEmbed = new EmbedBuilder()
    .setTitle("📝 Thank you for your suggestion!")
    .setDescription("Your suggestion has been submitted successfully!")
    .setColor("#3B82F6")
    .setTimestamp()
    .setFooter({
     text: `Suggested by ${interaction.member.user.globalName || interaction.member.user.username}`,
     iconURL: interaction.member.user.displayAvatarURL({
      size: 256,
     }),
    });

   return interaction.followUp({ ephemeral: true, embeds: [successEmbed] });
  } catch (error) {
   console.error("An error occurred:", error);
   return interaction.followUp({ content: "An error occurred while processing your suggestion.", ephemeral: true });
  }
 },
};
