import { loadImage, createCanvas, ImageData } from "@napi-rs/canvas";
import decodeGif from "decode-gif";
import { ApplicationCommandType, ApplicationCommandOptionType, AttachmentBuilder, EmbedBuilder } from "discord.js";
import GIFEncoder from "gif-encoder-2";

export default {
 name: "flag",
 description: "🏳️ Put a country flag on image",
 type: ApplicationCommandType.ChatInput,
 cooldown: 5000,
 dm_permission: false,
 usage: "/flag <country> [attachment/user]",
 options: [
  {
   name: "japan",
   description: "🇯🇵 Put a Japanese flag on image",
   type: ApplicationCommandOptionType.Subcommand,
   options: [
    {
     name: "attachment",
     description: "Attachment to put Japanese flag",
     type: ApplicationCommandOptionType.Attachment,
     required: false,
    },
    {
     name: "user",
     description: "User to put Japanese flag",
     type: ApplicationCommandOptionType.User,
     required: false,
    },
   ],
  },
  {
   name: "usa",
   description: "🇺🇸 Put a USA flag on image",
   type: ApplicationCommandOptionType.Subcommand,
   options: [
    {
     name: "attachment",
     description: "Attachment to put USA flag",
     type: ApplicationCommandOptionType.Attachment,
     required: false,
    },
    {
     name: "user",
     description: "User to put USA flag",
     type: ApplicationCommandOptionType.User,
     required: false,
    },
   ],
  },
  {
   name: "russia",
   description: "🇷🇺 Put a Russian flag on image",
   type: ApplicationCommandOptionType.Subcommand,
   options: [
    {
     name: "attachment",
     description: "Attachment to put Russian flag",
     type: ApplicationCommandOptionType.Attachment,
     required: false,
    },
    {
     name: "user",
     description: "User to put Rusian flag",
     type: ApplicationCommandOptionType.User,
     required: false,
    },
   ],
  },
  {
   name: "germany",
   description: "🇩🇪 Put a German flag on image",
   type: ApplicationCommandOptionType.Subcommand,
   options: [
    {
     name: "attachment",
     description: "Attachment to put German flag",
     type: ApplicationCommandOptionType.Attachment,
     required: false,
    },
    {
     name: "user",
     description: "User to put German flag",
     type: ApplicationCommandOptionType.User,
     required: false,
    },
   ],
  },
  {
   name: "poland",
   description: "🇵🇱 Put a Polish flag on image",
   type: ApplicationCommandOptionType.Subcommand,
   options: [
    {
     name: "attachment",
     description: "Attachment to put Polish flag",
     type: ApplicationCommandOptionType.Attachment,
     required: false,
    },
    {
     name: "user",
     description: "User to put Polish flag",
     type: ApplicationCommandOptionType.User,
     required: false,
    },
   ],
  },
 ],
 run: async (client, interaction, guildSettings) => {
  try {
   const countryFlags = {
    japan: "🇯🇵",
    usa: "🇺🇸",
    russia: "🇷🇺",
    germany: "🇩🇪",
    poland: "🇵🇱",
   };
   const subcommand = interaction.options.getSubcommand();
   const attachment = interaction.options.getAttachment("attachment");
   const user = interaction.options.getUser("user") || interaction.member.user;
   let image;

   if (attachment) {
    if (attachment.contentType !== "image/png" && attachment.contentType !== "image/jpg" && attachment.contentType !== "image/jpeg") {
     return client.errorMessages.createSlashError(interaction, "❌ The attachment must be a png, jpg, or jpeg file.");
    }
    image = attachment.proxyURL;
   } else {
    if (!user.displayAvatarURL({ size: 2048, extension: "png", forceStatic: true })) {
     return client.errorMessages.createSlashError(interaction, "❌ The user must have an avatar.");
    }
    image = user.displayAvatarURL({
     size: 2048,
     extension: "png",
     forceStatic: true,
    });
   }

   const targetImage = await loadImage(image.split("?")[0]);
   const background = await loadImage(`./util/images/files/${subcommand}.gif`);

   const gif = new GIFEncoder(background.width, background.height, "neuquant", true);
   gif.start();
   gif.setQuality(1);
   gif.setDelay(40);
   gif.setDispose(2);
   gif.setRepeat(0);

   const canvas = createCanvas(background.width, background.height);
   const context = canvas.getContext("2d");
   context.quality = "fast";
   context.patternQuality = "fast";

   const { frames } = decodeGif(background.src);

   for (let i = 0; i < frames.length; i++) {
    context.globalAlpha = 1;
    const frame = frames[i];
    const imageData = new ImageData(frame.data, background.width, background.height);
    context.putImageData(imageData, 0, 0);
    context.globalAlpha = 0.5;
    context.drawImage(targetImage, 0, 0, background.width, background.height);
    gif.addFrame(context);
   }

   gif.finish();

   const file = new AttachmentBuilder(gif.out.getData(), {
    name: "flag.gif",
   });

   const embed = new EmbedBuilder()
    .setTitle(`${countryFlags[subcommand]} ${subcommand.charAt(0).toUpperCase() + subcommand.slice(1)}`)
    .setImage("attachment://flag.gif")
    .setColor(guildSettings?.embedColor || client.config.defaultColor)
    .setTimestamp()
    .setFooter({
     text: `Requested by ${interaction.member.user.globalName || interaction.member.user.username}`,
     iconURL: interaction.member.user.displayAvatarURL({
      size: 256,
     }),
    });

   if (attachment && (attachment.width > 512 || attachment.height > 512)) {
    embed.setDescription("⚠️ Your attachment was resized to 510x510px because it was too big.");
   }

   return interaction.followUp({ embeds: [embed], files: [file] });
  } catch (err) {
   console.log(err);
   client.errorMessages.internalError(interaction, err);
  }
 },
};
