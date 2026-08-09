"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HiHome,
  HiCommandLine,
  HiBriefcase,
  HiAcademicCap,
  HiShieldCheck,
  HiChatBubbleLeftRight,
  HiShare,
  HiUser,
  HiBars3,
  HiXMark,
  HiArrowLeftOnRectangle
} from "react-icons/hi2";

const navItems = [
  { href: "/admin", label: "Overview", icon: HiHome },
  { href: "/admin/hero", label: "Hero Content", icon: HiUser },
  { href: "/admin/projects", label: "Projects", icon: HiCommandLine },
  { href: "/admin/skills", label: "Skills", icon: HiShieldCheck },
  { href: "/admin/experience", label: "Experience", icon: HiBriefcase },
  { href: "/admin/education", label: "Education", icon: HiAcademicCap },
  { href: "/admin/certificates", label: "Certificates", icon: HiShieldCheck },
  { href: "/admin/socials", label: "Socials & Resume", icon: HiShare },
  { href: "/admin/messages", label: "Messages", icon: HiChatBubbleLeftRight },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/admin/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (pathname === "/admin/login") {
    return children;
  }

  return (
    <div className="min-h-screen bg-[#050816] text-[#f5f6fa] flex">
      {/* Mobile Top Navbar */}
      <div className="flex md:hidden items-center justify-between w-full bg-[#0b0f1f] px-6 py-4 border-b border-white/10 fixed top-0 z-50">
        <Link href="/admin" className="font-display font-semibold text-lg tracking-tight">
          Admin<span className="grad-text">.</span>CMS
        </Link>
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-white hover:text-indigo-400"
          aria-label="Open sidebar"
        >
          <HiBars3 size={24} />
        </button>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-45 md:hidden backdrop-blur-sm"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-[#0b0f1f] border-r border-white/10 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <Link href="/admin" className="font-display font-semibold text-xl tracking-tight">
            M<span className="grad-text">.</span>Hassan Admin
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-white hover:text-indigo-400"
            aria-label="Close sidebar"
          >
            <HiXMark size={20} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                    : "text-[#8b93a7] hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-400 rounded-xl hover:bg-red-500/10 transition-colors"
          >
            <HiArrowLeftOnRectangle size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="hidden md:flex items-center justify-end h-16 px-8 bg-[#0b0f1f]/50 border-b border-white/10">
          <Link
            href="/"
            target="_blank"
            className="text-xs font-mono uppercase tracking-wider text-[#8b93a7] hover:text-indigo-400 transition-colors"
          >
            View Live Portfolio &rarr;
          </Link>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto mt-16 md:mt-0">
          <div className="max-w-5xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
