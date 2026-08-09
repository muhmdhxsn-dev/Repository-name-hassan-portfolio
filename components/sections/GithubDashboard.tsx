"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FiStar, FiGitBranch } from "react-icons/fi";
import { GITHUB_USERNAME as fallbackUsername } from "@/lib/data";
import RevealOnScroll from "../RevealOnScroll";

type GhUser = {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
};

type GhRepo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
};

export default function GithubDashboard({ username }: { username?: string }) {
  const activeUsername = username || fallbackUsername;
  const [user, setUser] = useState<GhUser | null>(null);
  const [repos, setRepos] = useState<GhRepo[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [uRes, rRes] = await Promise.all([
          fetch(`https://api.github.com/users/${activeUsername}`),
          fetch(`https://api.github.com/users/${activeUsername}/repos?sort=updated&per_page=6`),
        ]);
        if (!uRes.ok || !rRes.ok) throw new Error("fetch failed");
        setUser(await uRes.json());
        setRepos(await rRes.json());
      } catch {
        setError(true);
      }
    })();
  }, [activeUsername]);

  return (
    <section id="github" className="relative z-10 px-6 py-24 md:px-12">
      <div className="rule mb-20" aria-hidden="true" />
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="section-eyebrow mb-4">05 — GITHUB</div>
            <h2 className="section-title">
              LIVE FROM<br />
              GITHUB
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted md:text-right">
            Pulled live via the public GitHub API for{" "}
            <span className="font-mono text-accent">@{activeUsername}</span>.
          </p>
        </RevealOnScroll>

        <div className="grid gap-5 lg:grid-cols-3">
          <RevealOnScroll className="lg:col-span-1">
            <div className="h-full rounded-sm border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:border-accent/20">
              {error && <p className="text-sm text-muted">GitHub data unavailable right now — check your connection or rate limits.</p>}
              {!error && !user && <p className="animate-pulse font-mono text-xs text-muted">loading profile…</p>}
              {user && (
                <>
                  <div className="mb-5 flex items-center gap-4">
                    <div className="overflow-hidden rounded-sm border border-white/10">
                      <Image
                        src={user.avatar_url}
                        alt={`${user.login} avatar`}
                        width={56}
                        height={56}
                        className="transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <div>
                      <p className="risen-text text-sm tracking-[0.1em] text-white">{(user.name || user.login).toUpperCase()}</p>
                      <p className="font-mono text-[11px] text-muted">@{user.login}</p>
                    </div>
                  </div>
                  <p className="mb-5 text-sm leading-relaxed text-muted">{user.bio || "Building things with Python."}</p>
                  <div className="grid grid-cols-3 gap-3 border-t border-white/[0.06] pt-4 text-center">
                    <div>
                      <div className="risen-text text-lg text-white">{user.public_repos}</div>
                      <div className="risen-text text-[9px] tracking-[0.15em] text-muted/60">REPOS</div>
                    </div>
                    <div>
                      <div className="risen-text text-lg text-white">{user.followers}</div>
                      <div className="risen-text text-[9px] tracking-[0.15em] text-muted/60">FOLLOWERS</div>
                    </div>
                    <div>
                      <div className="risen-text text-lg text-white">{user.following}</div>
                      <div className="risen-text text-[9px] tracking-[0.15em] text-muted/60">FOLLOWING</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.05} className="lg:col-span-2">
            <div className="rounded-sm border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="risen-text mb-5 text-[10px] tracking-[0.2em] text-accent/80">RECENT REPOSITORIES</h3>
              {error && <p className="text-sm text-muted">Repositories will appear here once GitHub API access succeeds.</p>}
              {!error && repos.length === 0 && <p className="animate-pulse font-mono text-xs text-muted">loading repositories…</p>}
              <div className="grid gap-3 sm:grid-cols-2">
                {repos.map((r) => (
                  <a
                    key={r.id}
                    href={r.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-hover
                    className="block rounded-sm border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-200 hover:border-accent/25 hover:bg-white/[0.04]"
                  >
                    <p className="risen-text mb-1 truncate text-[11px] tracking-[0.1em] text-white/90">{r.name.toUpperCase()}</p>
                    <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-muted">{r.description || "No description"}</p>
                    <div className="flex items-center gap-3">
                      <span className="risen-text flex items-center gap-1.5 text-[9px] tracking-[0.12em] text-muted/60">
                        <FiStar size={10} />{r.stargazers_count}
                      </span>
                      {r.language && (
                        <span className="risen-text flex items-center gap-1.5 text-[9px] tracking-[0.12em] text-muted/60">
                          <FiGitBranch size={10} />{r.language}
                        </span>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}

