import { ApplicationCommandType, ApplicationCommandOptionType, ChannelType, PermissionsBitField, PermissionFlagsBits } from "discord.js";
import { EndGiveaway } from "../../util/giveaway/endGiveaway.js";
import { FindGiveaways } from "../../util/giveaway/findGiveaways.js";
import { PauseGiveaway } from "../../util/giveaway/pauseGiveaway.js";
import { RerollGiveaway } from "../../util/giveaway/rerollGiveaway.js";
import { ResumeGiveaway } from "../../util/giveaway/resumeGiveaway.js";
import { StartDropGiveaway, StartGiveaway } from "../../util/giveaway/startGiveaway.js";

export default {
  name: "giveaway",
  description: "🎉 Manage giveaways",
  type: ApplicationCommandType.ChatInput,
  cooldown: 3000,
  dm_permission: false,
  defer: false,
  usage: "/giveaway <command>",
  permissions: [PermissionFlagsBits.ManageGuild],
  options: [
    {
      name: "start",
      description: "🎉 Start a giveaway",
      type: ApplicationCommandOptionType.Subcommand,
      usage: "/giveaway start <time> <winners> <channel> <prize>",
      options: [
        {
          name: "time",
          description: "Time to end giveaway <d/h/m>",
          type: ApplicationCommandOptionType.String,
          min_length: 2,
          max_length: 15,
          required: true,
        },
        {
          name: "winners",
          description: "Winner count",
          type: ApplicationCommandOptionType.Integer,
          min_value: 1,
          max_value: 100,
          required: true,
        },
        {
          name: "channel",
          description: "Channel on which you want to create the giveaway",
          type: ApplicationCommandOptionType.Channel,
          channel_types: [ChannelType.GuildText],
          required: true,
        },
        {
          name: "prize",
          description: "Prize of the giveaway",
          type: ApplicationCommandOptionType.String,
          required: true,
          max_length: 100,
        },
      ],
    },
    {
      name: "drop",
      description: "🎉 Create a drop giveaway",
      type: ApplicationCommandOptionType.Subcommand,
      usage: "/drop-giveaway <winners> <channel> <prize>",
      options: [
        {
          name: "winners",
          description: "Winner count",
          type: ApplicationCommandOptionType.Integer,
          min_value: 1,
          max_value: 100,
          required: true,
        },
        {
          name: "channel",
          description: "Channel on which you want to create the giveaway",
          type: ApplicationCommandOptionType.Channel,
          channel_types: [ChannelType.GuildText],
          required: true,
        },
        {
          name: "prize",
          description: "Prize of the giveaway",
          type: ApplicationCommandOptionType.String,
          required: true,
          max_length: 100,
        },
      ],
    },
    {
      name: "end",
      description: "🎉 End a giveaway",
      type: ApplicationCommandOptionType.Subcommand,
      usage: "/giveaway end <giveaway id>",
      options: [
        {
          name: "query",
          description: "Giveaway ID (Message ID)",
          type: ApplicationCommandOptionType.String,
          required: true,
          max_length: 100,
        },
      ],
    },
    {
      name: "pause",
      description: "🎉 Pause a giveaway",
      type: ApplicationCommandOptionType.Subcommand,
      usage: "/giveaway pause <giveaway id>",
      options: [
        {
          name: "query",
          description: "Giveaway ID (Message ID)",
          type: ApplicationCommandOptionType.String,
          required: true,
          max_length: 100,
        },
      ],
    },
    {
      name: "resume",
      description: "🎉 Resume a giveaway",
      type: ApplicationCommandOptionType.Subcommand,
      usage: "/giveaway resume <giveaway id>",
      options: [
        {
          name: "query",
          description: "Giveaway ID (Message ID)",
          type: ApplicationCommandOptionType.String,
          required: true,
          max_length: 100,
        },
      ],
    },
    {
      name: "list",
      description: "🎉 Get list of all giveaways",
      type: ApplicationCommandOptionType.SubcommandGroup,
      usage: "/giveaway list",
      options: [
        {
          name: "all",
          description: "🎉 Get list of all giveaways",
          type: ApplicationCommandOptionType.Subcommand,
          usage: "/giveaway list all",
        },
        {
          name: "running",
          description: "🎉 Get list of all running giveaways",
          type: ApplicationCommandOptionType.Subcommand,
          usage: "/giveaway list running",
        },
        {
          name: "ended",
          description: "🎉 Get list of all ended giveaways",
          type: ApplicationCommandOptionType.Subcommand,
          usage: "/giveaway list ended",
        },
      ],
    },
    {
      name: "reroll",
      description: "🎉 Reroll a giveaway",
      type: ApplicationCommandOptionType.Subcommand,
      usage: "/giveaway reroll <giveaway id>",
      options: [
        {
          name: "query",
          description: "Giveaway ID (Message ID)",
          type: ApplicationCommandOptionType.String,
          required: true,
          max_length: 100,
        },
      ],
    },
  ],
  run: async (client, interaction, guildSettings) => {
    try {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
        return client.errorMessages.createSlashError(interaction, "❌ You don't have permission to use this command. You need `Manage Server` permission.");
      }

      const type = interaction.options.getSubcommand();
      if (type === "start") {
        await StartGiveaway(client, interaction, guildSettings?.embedColor || client.config.defaultColor);
      } else if (type === "drop") {
        await StartDropGiveaway(client, interaction, guildSettings?.embedColor || client.config.defaultColor);
      } else if (type === "end") {
        await EndGiveaway(client, interaction, guildSettings?.embedColor || client.config.defaultColor);
      } else if (type === "pause") {
        await PauseGiveaway(client, interaction, guildSettings?.embedColor || client.config.defaultColor);
      } else if (type === "resume") {
        await ResumeGiveaway(client, interaction, guildSettings?.embedColor || client.config.defaultColor);
      } else if (type === "reroll") {
        await RerollGiveaway(client, interaction, guildSettings?.embedColor || client.config.defaultColor);
      } else if (type === "all" || type === "running" || type === "ended") {
        await FindGiveaways(client, interaction, guildSettings?.embedColor || client.config.defaultColor, type);
      }
    } catch (err) {
      client.errorMessages.internalError(interaction, err);
    }
  },
};
