import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  HiCommandLine,
  HiBriefcase,
  HiAcademicCap,
  HiShieldCheck,
  HiChatBubbleLeftRight,
  HiUser,
} from "react-icons/hi2";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  let stats = {
    projects: 0,
    skills: 0,
    messages: 0,
    experience: 0,
  };
  let latestMessages: any[] = [];

  try {
    const [projectCount, skillCount, messageCount, experienceCount, unreadMessages] = await Promise.all([
      prisma.project.count(),
      prisma.skill.count(),
      prisma.contactMessage.count(),
      prisma.experience.count(),
      prisma.contactMessage.findMany({
        where: { isRead: false },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    stats = {
      projects: projectCount,
      skills: skillCount,
      messages: messageCount,
      experience: experienceCount,
    };
    latestMessages = unreadMessages;
  } catch (error) {
    console.error("Dashboard stats query failed:", error);
  }

  const quickLinks = [
    { href: "/admin/hero", label: "Edit Hero Content", desc: "Change your name, subtitle, titles, and resume links.", icon: HiUser, color: "text-blue-400" },
    { href: "/admin/projects", label: "Manage Projects", desc: "Add, edit, or reorder items in your portfolio project list.", icon: HiCommandLine, color: "text-indigo-400" },
    { href: "/admin/skills", label: "Skills Catalog", desc: "Update your technical stacks and skill sets.", icon: HiShieldCheck, color: "text-emerald-400" },
    { href: "/admin/messages", label: "View Messages", desc: `Read and answer contact messages (${stats.messages} total).`, icon: HiChatBubbleLeftRight, color: "text-purple-400" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-white">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-[#8b93a7]">
          Welcome back! Here is a summary of your portfolio state.
        </p>
      </div>

      <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">
        <div className="glass p-5 rounded-2xl border border-white/10">
          <p className="text-xs font-mono uppercase tracking-wider text-[#8b93a7]">Projects</p>
          <p className="mt-2 text-3xl font-bold text-white">{stats.projects}</p>
        </div>
        <div className="glass p-5 rounded-2xl border border-white/10">
          <p className="text-xs font-mono uppercase tracking-wider text-[#8b93a7]">Skill Categories</p>
          <p className="mt-2 text-3xl font-bold text-white">{stats.skills}</p>
        </div>
        <div className="glass p-5 rounded-2xl border border-white/10">
          <p className="text-xs font-mono uppercase tracking-wider text-[#8b93a7]">Experience Items</p>
          <p className="mt-2 text-3xl font-bold text-white">{stats.experience}</p>
        </div>
        <div className="glass p-5 rounded-2xl border border-white/10">
          <p className="text-xs font-mono uppercase tracking-wider text-[#8b93a7]">Total Messages</p>
          <p className="mt-2 text-3xl font-bold text-white">{stats.messages}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <h2 className="font-display text-xl font-semibold text-white">Quick Actions</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="glass group p-6 rounded-2xl border border-white/10 hover:border-indigo-500/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className={`p-3 w-fit rounded-xl bg-white/5 group-hover:bg-indigo-500/10 transition-colors ${link.color}`}>
                      <Icon size={20} />
                    </div>
                    <h3 className="mt-4 font-semibold text-white group-hover:text-indigo-400 transition-colors">
                      {link.label}
                    </h3>
                    <p className="mt-1 text-xs text-[#8b93a7] leading-relaxed">
                      {link.desc}
                    </p>
                  </div>
                  <span className="mt-4 text-[10px] font-mono text-indigo-400 group-hover:underline">
                    Manage &rarr;
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-white">Unread Inbox</h2>
            <Link
              href="/admin/messages"
              className="text-xs font-mono text-indigo-400 hover:underline"
            >
              All Messages
            </Link>
          </div>

          <div className="glass p-5 rounded-2xl border border-white/10 space-y-4 h-[330px] overflow-y-auto">
            {latestMessages.length === 0 ? (
              <p className="text-center text-xs text-[#8b93a7] py-12">
                No unread messages. Good job!
              </p>
            ) : (
              latestMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="pb-4 border-b border-white/5 last:border-0 last:pb-0 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-white truncate">{msg.name}</p>
                    <p className="text-[10px] text-[#8b93a7] shrink-0">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-[#8b93a7] truncate mt-1">{msg.email}</p>
                  <p className="text-[#f5f6fa]/80 line-clamp-2 mt-1.5 leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
