import { Block } from "@/components/Block";
import { Header1, Header2 } from "@/components/Headers";
import { Icons, iconVariants } from "@/components/Icons";
import { InputSkeleton, TextSkeleton } from "@/components/Skeletons";

export default async function Loading() {
 return (
  <>
   <Header1>
    <Icons.packagePlus className={iconVariants({ variant: "extraLarge" })} />
    Tickets
   </Header1>
   <Block className="mt-4">
    <p className="mb-4 mt-2 text-left">This feature is still under development.</p>

    <div className="flex flex-wrap items-stretch justify-start gap-8">
     {Array.from({ length: 8 }).map((_, i) => (
      <TextSkeleton
       key={i}
       style={{
        width: `${Math.floor(Math.random() * (500 - 200 + 1) + 200)}px !important`,
       }}
       className="!h-44 !min-w-[400px] !max-w-none"
      />
     ))}
    </div>
   </Block>
  </>
 );
}
