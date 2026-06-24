"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", icon: "🏠", path: "/dashboard" },
    { name: "AI Assistant", icon: "🤖", path: "/assistant" },
    { name: "Study Planner", icon: "📚", path: "/study-planner" },
    { name: "Placement", icon: "💼", path: "/placement" },
    { name: "Documents", icon: "📄", path: "/documents" },
    { name: "Search", icon: "🔍", path: "/document-search" },
    { name: "OCR Scanner", icon: "📸", path: "/ocr" },
    { name: "Habits", icon: "📈", path: "/habits" },
    {name: "Resume Builder", icon: "📄", path: "/resume-builder" },
    { name: "Reminders", icon: "⏰", path: "/reminders" },
    { name: "Profile", icon: "👤", path: "/profile" },
  ];

  return (
    <div className="bg-white text-black dark:bg-gray-900 dark:text-white">
    <div className="w-72 min-h-screen bg-slate-900 border-r border-slate-800">

      <div className="p-6 border-b border-slate-800">

        <h1 className="text-3xl font-bold text-white">
          LifeOS AI
        </h1>

        <p className="text-slate-400 mt-2">
          Personal Life Management
        </p>

      </div>

<div className="hidden md:flex">
  {/* Desktop Sidebar */}
</div>
<div className="md:hidden">
  {/* Mobile Menu Button */}
</div>
      <div className="p-4">

        {menu.map((item) => (
          <Link
            key={item.path}
            href={item.path}
          >
            <div
              className={`flex items-center gap-4 p-4 rounded-xl mb-2 transition-all
              ${
                pathname === item.path
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <span className="text-xl">
                {item.icon}
              </span>

              <span className="font-medium">
                {item.name}
              </span>
            </div>
          </Link>
        ))}

      </div>
    </div>
    </div>
  );
}