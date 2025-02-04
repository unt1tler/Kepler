"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { VisibilityContext } from "./VisibilityContext";
import { ButtonPrimary } from "@/components/Buttons";
import { Icons, iconVariants } from "@/components/Icons";

export function NavBadge({ children }) {
 return <div className="bg-button-primary -mt-3 rounded-md px-1 py-px pb-0 text-xs uppercase">{children}</div>;
}

export function SideNavLink({ href, children }) {
 const router = usePathname();
 const isSelected = (path) => router === path;
 return (
  <Link href={href} className={`${isSelected(href) ? "bg-button-primary/20 before:!h-[29px]" : "hover:bg-button-primary/20"} before:border-button-primary hover:bg-button-primary/20 flex h-[45px] w-full items-center gap-2 rounded-md py-2 pr-4 duration-200 before:h-0 before:rounded-r-md before:border-l-4 before:duration-200 hover:before:h-[29px]`}>
   {children}
  </Link>
 );
}

export function SideNav({ server }) {
 const { sideNavVisible, toggleSideNav } = useContext(VisibilityContext);

 return (
  <>
   {sideNavVisible && <div className="fixed inset-0 z-[1000] h-full w-full bg-black/50 duration-200" onClick={() => sideNavVisible && toggleSideNav()} />}
   <aside
    className={clsx(
     {
      "pointer-events-none opacity-0": !sideNavVisible,
      "opacity-100": sideNavVisible,
     },
     "bg-background-navbar fixed z-[9998] mt-8 flex h-screen w-64 flex-none flex-col flex-nowrap overflow-y-auto overflow-x-hidden border-r border-r-neutral-800 py-8 pb-32 shadow-lg duration-100 md:pointer-events-auto md:top-0 md:mt-16 md:opacity-100"
    )}
   >
    <div className="px-4">
     <ButtonPrimary href="/dashboard" className="mb-4 w-full">
      <Icons.arrowLeft className={iconVariants({ variant: "button" })} /> Go back
     </ButtonPrimary>
    </div>

    <div className="flex w-full flex-col items-center justify-center gap-2 border-t border-t-neutral-800 px-4 pt-4">
     <SideNavLink href={`/dashboard/${server}`}>
      <Icons.home className={iconVariants({ variant: "large" })} />
      Overview
     </SideNavLink>
     <SideNavLink href={`/dashboard/${server}/statistics`}>
      <Icons.trendingUp className={iconVariants({ variant: "large" })} />
      Statistics
     </SideNavLink>
     <SideNavLink href={`/dashboard/${server}/leaderboard`}>
      <Icons.sparkles className={iconVariants({ variant: "large" })} />
      Leaderboard
     </SideNavLink>
     <SideNavLink href={`/dashboard/${server}/giveaways`}>
      <Icons.gift className={iconVariants({ variant: "large" })} />
      Giveaways
     </SideNavLink>
    </div>

    <div className="text-text mt-2 border-t border-white/20 px-5 py-2 opacity-40">Moderation</div>
    <div className="flex w-full flex-col items-center justify-center gap-2 px-4">
     <SideNavLink href={`/dashboard/${server}/warns`}>
      <Icons.warning className={iconVariants({ variant: "large" })} />
      Warns
     </SideNavLink>
     <SideNavLink href={`/dashboard/${server}/logs`}>
      <Icons.list className={iconVariants({ variant: "large" })} />
      Logs
     </SideNavLink>
    </div>
    <div className="text-text mt-2 border-t border-white/20 px-5 py-2 opacity-40">Management</div>
    <div className="flex w-full flex-col items-center justify-center gap-2 px-4">
     <SideNavLink href={`/dashboard/${server}/modules`}>
      <Icons.packagePlus className={iconVariants({ variant: "large" })} />
      Modules
     </SideNavLink>
     <SideNavLink href={`/dashboard/${server}/automod`}>
      <Icons.bot className={iconVariants({ variant: "large" })} />
      Automod<NavBadge>beta</NavBadge>
     </SideNavLink>
     <SideNavLink href={`/dashboard/${server}/messages`}>
      <Icons.messageCode className={iconVariants({ variant: "large" })} />
      Custom messages
     </SideNavLink>
     <SideNavLink href={`/dashboard/${server}/settings`}>
      <Icons.settings className={iconVariants({ variant: "large" })} />
      Settings
     </SideNavLink>
     <SideNavLink href={`/dashboard/${server}/tickets`}>
      <Icons.packagePlus className={iconVariants({ variant: "large" })} />
      Tickets<NavBadge>Soon</NavBadge>
     </SideNavLink>
    </div>
   </aside>
  </>
 );
}
