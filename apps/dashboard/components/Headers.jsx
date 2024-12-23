import { twMerge } from "tailwind-merge";

export function HeaderBig({ children, className, ...props }) {
 return (
  <h1 className={twMerge(className, "pt-4 text-center text-4xl font-extrabold text-white md:text-6xl")} {...props}>
   {children}
  </h1>
 );
}

export function GradientHeader({ children, className, ...props }) {
 return (
  <h1 className={twMerge(className, "text-fill-transparent mb-0 flex items-center gap-4 bg-gradient-to-b from-white to-neutral-400 box-decoration-clone	bg-clip-text text-left text-xl font-black md:text-2xl")} {...props}>
   {children}
  </h1>
 );
}

export function Header1({ children, className, ...props }) {
 return (
  <h1 className={twMerge("mb-2 flex items-center justify-start gap-2 text-3xl font-bold", className)} {...props}>
   {children}
  </h1>
 );
}

export function Header2({ children, className, ...props }) {
 return (
  <h2 className={twMerge("mb-1 flex items-center justify-start gap-2 text-left text-2xl font-bold", className)} {...props}>
   {children}
  </h2>
 );
}

export function Header3({ children, className, ...props }) {
 return (
  <h3 className={twMerge("mb-1 flex items-center gap-2 text-center text-xl font-bold", className)} {...props}>
   {children}
  </h3>
 );
}

export function Header4({ children, className, ...props }) {
 return (
  <h4 className={twMerge(className, "flex items-center gap-4 text-center text-lg font-bold md:text-xl")} {...props}>
   {children}
  </h4>
 );
}

export function Header5({ children, className, ...props }) {
 return (
  <h5 className={twMerge(className, "flex items-center gap-4 text-center text-base font-medium md:text-lg")} {...props}>
   {children}
  </h5>
 );
}
