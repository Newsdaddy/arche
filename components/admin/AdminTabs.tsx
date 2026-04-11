"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { id: "overview", label: "대시보드", href: "/admin", icon: "📊" },
  { id: "members", label: "가입자", href: "/admin/members", icon: "👥" },
  { id: "paid", label: "유료 가입자", href: "/admin/paid-members", icon: "💎" },
  { id: "consulting", label: "상담 고객", href: "/admin/consulting", icon: "🎯" },
  { id: "inquiries", label: "문의함", href: "/admin/inquiries", icon: "💬" },
];

interface AdminTabsProps {
  pendingInquiries?: number;
}

export default function AdminTabs({ pendingInquiries = 0 }: AdminTabsProps) {
  const pathname = usePathname();

  const getActiveTab = () => {
    if (pathname === "/admin") return "overview";
    if (pathname.startsWith("/admin/members")) return "members";
    if (pathname.startsWith("/admin/paid-members")) return "paid";
    if (pathname.startsWith("/admin/consulting")) return "consulting";
    if (pathname.startsWith("/admin/inquiries")) return "inquiries";
    return "overview";
  };

  const activeTab = getActiveTab();

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="flex space-x-1 overflow-x-auto pb-px">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const showBadge = tab.id === "inquiries" && pendingInquiries > 0;

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap
                border-b-2 transition-colors
                ${isActive
                  ? "border-accent text-accent"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {showBadge && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {pendingInquiries}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
