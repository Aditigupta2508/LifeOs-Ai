"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideSidebar =
    pathname === "/login" ||
    pathname === "/register";

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {!hideSidebar && <Sidebar />}

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}