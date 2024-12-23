import prismaClient from "@kepler/database";
import { ApplicationCommandType, EmbedBuilder, codeBlock, Status } from "discord.js";

export default {
 name: "ping",
 description: "🏓 Check Kepler's ping",
 type: ApplicationCommandType.ChatInput,
 cooldown: 3000,
 usage: "/ping",
 dm_permission: true,
 run: async (client, interaction, guildSettings) => {
  try {
   const dbTime = performance.now();
   await prismaClient.user.findUnique({ where: { id: "1" } });
   const dbTiming = performance.now() - dbTime;

   const waitEmbed = new EmbedBuilder().setColor(guildSettings?.embedColor || client.config.defaultColor).setDescription("🏓 Pong!...");
   const message = await interaction.followUp({ embeds: [waitEmbed] });
   const thisServerShard = client.ws.shards.get(interaction.guild.shardId);

   const pingMessage = new EmbedBuilder()
    .setColor(guildSettings?.embedColor || client.config.defaultColor)
    .setTimestamp()
    .setTitle("🏓 Pong!")
    .addFields([
     {
      name: "Host Latency",
      value: codeBlock("yaml", client.ws.ping > 0 ? `${Math.floor(client.ws.ping)}ms` : "Calculating..."),
      inline: true,
     },
     {
      name: "Client Latency",
      value: codeBlock("yaml", `${Math.floor(message.createdTimestamp - interaction.createdTimestamp)}ms`),
      inline: true,
     },
     {
      name: "Database Latency",
      value: codeBlock("yaml", `${Math.floor(dbTiming)}ms`),
      inline: true,
     },
     {
      name: "Websocket",
      value: codeBlock("yaml", `${Status[thisServerShard.status]}`),
      inline: true,
     },
     {
      name: "Shard",
      value: codeBlock("yaml", `${thisServerShard.id}/${client.ws.shards.size} (${thisServerShard.ping > 0 ? `${Math.floor(thisServerShard.ping)}ms` : "Calculating..."})`),
      inline: true,
     },
     {
      name: "💡 Did you know about this?",
      value: ">>> **The host stats above are due to our wonderful hosting - [AcademyGaming](https://www.academy-hosting.com/aff.php?aff=10)**. Register now and try their __VPS, Minecraft, FiveM, Node.js, Java and many more game server/bot hostings!__",
     },
    ])
    .setFooter({
     text: `Requested by ${interaction.member.user.globalName || interaction.member.user.username}`,
     iconURL: interaction.member.user.displayAvatarURL({
      size: 256,
     }),
    });
   await message.edit({ ephemeral: false, embeds: [pingMessage] });
  } catch (err) {
   client.errorMessages.internalError(interaction, err);
  }
 },
};
