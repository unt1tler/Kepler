/* eslint-disable complexity */

import { globalConfig } from "@kepler/config";
import prismaClient from "@kepler/database";
import { createHTTPAutomodRule, validateAutoModIgnores, validateAutoModRuleActions } from "@kepler/util/functions/automod";
import { getServer, getGuildMember } from "@kepler/util/functions/guild";
import { AutoModerationActionType, AutoModerationRuleTriggerType, AutoModerationRuleEventType, ChannelType } from "discord-api-types/v10";
import { getSession } from "lib/session";
import { NextResponse } from "next/server";

export async function POST(request) {
 try {
  const session = await getSession();
  const start = Date.now();

  if (!session || !session.access_token) {
   return NextResponse.json(
    {
     error: "Unauthorized - you need to log in first",
    },
    {
     status: 401,
     headers: {
      ...(process.env.NODE_ENV !== "production" && {
       "Server-Timing": `response;dur=${Date.now() - start}ms`,
      }),
     },
    }
   );
  }

  const cloned = await request.clone();
  const data = await cloned.json();

  if (!data) {
   return NextResponse.json(
    {
     error: "Bad Request - incomplete data",
     code: 400,
    },
    {
     status: 400,
     headers: {
      ...(process.env.NODE_ENV !== "production" && {
       "Server-Timing": `response;dur=${Date.now() - start}ms`,
      }),
     },
    }
   );
  }

  if (!data.actions || data.actions.length === 0) {
   data.actions = [
    {
     type: AutoModerationActionType.BlockMessage,
     metadata: {
      custom_message: "Message blocked due to containing an link. Rule added by Kepler",
     },
    },
   ];
  }

  if (
   // prettier
   !data ||
   !data.id ||
   typeof data.id !== "string" ||
   typeof data.enabled !== "boolean" ||
   !data.exemptRoles ||
   !data.exemptChannels ||
   !data.actions ||
   !Array.isArray(data.actions) ||
   !Array.isArray(data.exemptRoles) ||
   !Array.isArray(data.exemptChannels) ||
   !data.exemptRoles.every((r) => typeof r === "string") ||
   !data.exemptChannels.every((c) => typeof c === "string") ||
   !data.actions.every((a) => a.type !== AutoModerationActionType.BlockMessage || a.type !== AutoModerationActionType.SendAlertMessage || a.type !== AutoModerationActionType.Timeout)
  ) {
   return NextResponse.json(
    {
     error: "Bad Request - incomplete data",
     code: 400,
    },
    {
     status: 400,
     headers: {
      ...(process.env.NODE_ENV !== "production" && {
       "Server-Timing": `response;dur=${Date.now() - start}ms`,
      }),
     },
    }
   );
  }

  const server = await getServer(data.id);

  if (!server || server.error) {
   return NextResponse.json(
    {
     error: "Unable to find this server",
     code: 404,
    },
    {
     status: 404,
     headers: {
      ...(process.env.NODE_ENV !== "production" && {
       "Server-Timing": `response;dur=${Date.now() - start}ms`,
      }),
     },
    }
   );
  }

  if (!server.bot) {
   return NextResponse.json(
    {
     error: "Bot is unable to find this server",
     code: 404,
    },
    {
     status: 404,
     headers: {
      ...(process.env.NODE_ENV !== "production" && {
       "Server-Timing": `response;dur=${Date.now() - start}ms`,
      }),
     },
    }
   );
  }

  const serverMember = await getGuildMember(server.id, session.access_token);

  if (!serverMember || !serverMember.permissions_names || !serverMember.permissions_names.includes("ManageGuild") || !serverMember.permissions_names.includes("Administrator")) {
   return NextResponse.json(
    {
     error: "Unauthorized - you need to log in first",
     code: 401,
    },
    {
     status: 401,
     headers: {
      ...(process.env.NODE_ENV !== "production" && {
       "Server-Timing": `response;dur=${Date.now() - start}ms`,
      }),
     },
    }
   );
  }

  await prismaClient.guild.upsert({
   where: {
    guildId: server.id,
   },
   update: {},
   create: {
    guildId: server.id,
   },
   include: {
    autoMod: {
     where: {
      guildId: server.id,
     },
    },
   },
  });

  const allRolesFetch = await fetch(`https://discord.com/api/v${globalConfig.apiVersion}/guilds/${server.id}/roles`, {
   method: "GET",
   headers: {
    Authorization: `Bot ${process.env.TOKEN}`,
   },
  }).then((res) => res.json());

  const allChannelsFetch = await fetch(`https://discord.com/api/v${globalConfig.apiVersion}/guilds/${server.id}/channels`, {
   method: "GET",
   headers: {
    Authorization: `Bot ${process.env.TOKEN}`,
   },
  }).then((res) => res.json());

  const allRoles = allRolesFetch
   .map((role) => {
    if (role.name === "@everyone") return null;
    return {
     id: role.id,
     name: role.name,
     color: role.color ? `#${role.color.toString(16).toUpperCase()}` : "#FFFFFF",
    };
   })
   .filter(Boolean);

  const allChannels = allChannelsFetch
   .map((channel) => {
    if (channel.type !== ChannelType.GuildText) return null;

    return {
     id: channel.id,
     name: channel.name,
     type: channel.type,
     permissions: channel.permission_overwrites,
    };
   })
   .filter(Boolean);

  const validatedIgnores = await validateAutoModIgnores(allChannels, allRoles, data.exemptRoles, data.exemptChannels);

  if (validatedIgnores.error || validatedIgnores.code !== 200) {
   return NextResponse.json(
    {
     error: validatedIgnores.error,
     code: validatedIgnores.code,
    },
    {
     status: validatedIgnores.code,
     headers: {
      ...(process.env.NODE_ENV !== "production" && {
       "Server-Timing": `response;dur=${Date.now() - start}ms`,
      }),
     },
    }
   );
  }

  const validatedActions = await validateAutoModRuleActions(data.actions, allChannels, "Message blocked due to containing an link. Rule added by Kepler");

  if (validatedActions.error) {
   return NextResponse.json(
    {
     error: validatedActions.error,
     code: validatedActions.code,
    },
    {
     status: validatedActions.code,
     headers: {
      ...(process.env.NODE_ENV !== "production" && {
       "Server-Timing": `response;dur=${Date.now() - start}ms`,
      }),
     },
    }
   );
  }

  if (!validatedActions || validatedActions.length === 0) {
   return NextResponse.json(
    {
     error: "You must have at least one action enabled",
     code: 400,
    },
    {
     status: 400,
     headers: {
      ...(process.env.NODE_ENV !== "production" && {
       "Server-Timing": `response;dur=${Date.now() - start}ms`,
      }),
     },
    }
   );
  }

  const createdRule = await createHTTPAutomodRule(server.id, "anti-link", {
   enabled: data.enabled,
   name: "Disallow links [keplerbot.xyz]",
   actions: validatedActions,
   event_type: AutoModerationRuleEventType.MessageSend,
   trigger_type: AutoModerationRuleTriggerType.Keyword,
   exempt_roles: data.exemptRoles,
   exempt_channels: data.exemptChannels,
   trigger_metadata: {
    regex_patterns: ["(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"],
   },
  });

  if (createdRule.error) {
   return NextResponse.json(
    {
     error: createdRule.error,
     code: createdRule.code,
    },
    {
     status: createdRule.code,
     headers: {
      ...(process.env.NODE_ENV !== "production" && {
       "Server-Timing": `response;dur=${Date.now() - start}ms`,
      }),
     },
    }
   );
  } else {
   return NextResponse.json(
    {
     message: "Successfully updated the anti-link system",
     code: 200,
    },
    {
     status: 200,
     headers: {
      ...(process.env.NODE_ENV !== "production" && {
       "Server-Timing": `response;dur=${Date.now() - start}ms`,
      }),
     },
    }
   );
  }
 } catch (err) {
  console.log(err);
  return NextResponse.json(
   {
    error: "Internal Server Error",
    code: 500,
   },
   {
    status: 500,
   }
  );
 }
}
