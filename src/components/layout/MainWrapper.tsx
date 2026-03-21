"use client";

import { usePathname } from "next/navigation";

export function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  if (isLanding) {
    return <main>{children}</main>;
  }

  return (
    <main className="max-w-lg mx-auto pb-20 lg:max-w-7xl lg:mx-auto lg:px-8 lg:pt-20 lg:pb-8">
      {children}
    </main>
  );
}
