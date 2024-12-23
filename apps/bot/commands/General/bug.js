import { ApplicationCommandType, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

export default {
 name: "bug",
 description: "Report a bug to the Kepler team.",
 type: ApplicationCommandType.ChatInput,
 cooldown: 10000,
 dm_permission: false,
 defer: false,
 usage: "/bug",
 run: async (client, interaction) => {
  try {
   const modal = new ModalBuilder() // prettier
    .setCustomId("bug")
    .setTitle("📝 bug");
   const bug = new TextInputBuilder() // prettier
    .setCustomId("bug")
    .setPlaceholder("Describe the bug here...")
    .setMinLength(5)
    .setMaxLength(500)
    .setRequired(true)
    .setStyle(TextInputStyle.Paragraph)
    .setLabel("bug");

   const action = new ActionRowBuilder().addComponents(bug);

   modal.addComponents(action);
   await interaction.showModal(modal);
  } catch (err) {
   client.errorMessages.internalError(interaction, err);
  }
 },
};
