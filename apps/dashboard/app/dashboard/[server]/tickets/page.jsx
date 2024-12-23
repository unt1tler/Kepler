import { botConfig } from "@kepler/config";
import prismaClient from "@kepler/database";
import { getGuildMember, getServer } from "@kepler/util/functions/guild";
import clsx from "clsx";
import { getSession } from "lib/session";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { Block } from "@/components/Block";
import { Header1, Header2, Header3 } from "@/components/Headers";
import { Icons, iconVariants } from "@/components/Icons";

export default async function TicketsPage({ params }) {
 const session = await getSession();
 if (!session || !session.access_token) redirect("/auth/login");
 const { server } = params;
 const serverDownload = await getServer(server);
 if (!serverDownload || serverDownload.code === 10004 || !serverDownload.bot) return notFound();
 const serverMember = await getGuildMember(serverDownload.id, session.access_token);
 if (
  // prettier
  !serverMember ||
  !serverMember.permissions_names ||
  !serverMember.permissions_names.includes("ManageGuild") ||
  !serverMember.permissions_names.includes("Administrator")
 )
  return notFound();

 return (
  <>
   <Header1>
    <Icons.packagePlus className={iconVariants({ variant: "extraLarge" })} />
    Coming Soon
   </Header1>
   <Block className="mt-4">
    <Header2>
     <Icons.blocks className={iconVariants({ variant: "large", className: "!stroke-2" })} />
     Tickets
    </Header2>
    <p className="mb-4 mt-2 text-left">This feature is still under development.</p>
   </Block>
  </>
 );
}
