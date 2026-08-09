"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FiStar } from "react-icons/fi";
import { GITHUB_USERNAME as fallbackUsername } from "@/lib/data";
import RevealOnScroll from "../RevealOnScroll";
import { Card } from "../ui/card";

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
    <section id="github" className="relative z-10 px-6 py-28 md:px-12">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll className="mb-14">
          <div className="section-eyebrow mb-3">05 — GITHUB</div>
          <h2 className="font-display text-4xl font-semibold md:text-5xl">Live from GitHub</h2>
          <p className="mt-3 max-w-lg text-muted">
            Pulled live via the public GitHub API for user{" "}
            <span className="font-mono text-white">@{activeUsername}</span>.
          </p>
        </RevealOnScroll>

        <div className="grid gap-6 lg:grid-cols-3">
          <RevealOnScroll className="lg:col-span-1">
            <Card className="p-6">
              {error && <p className="text-sm text-muted">GitHub data unavailable right now — check your connection or rate limits.</p>}
              {!error && !user && <p className="animate-pulse font-mono text-xs text-muted">loading profile…</p>}
              {user && (
                <>
                  <div className="mb-5 flex items-center gap-4">
                    <Image
                      src={user.avatar_url}
                      alt={`${user.login} avatar`}
                      width={64}
                      height={64}
                      className="rounded-full border border-white/10"
                    />
                    <div>
                      <p className="font-semibold">{user.name || user.login}</p>
                      <p className="font-mono text-xs text-muted">@{user.login}</p>
                    </div>
                  </div>
                  <p className="mb-5 text-sm text-muted">{user.bio || "Building things with Python."}</p>
                  <div className="grid grid-cols-3 gap-3 text-center text-sm">
                    <div>
                      <div className="font-display text-lg font-semibold">{user.public_repos}</div>
                      <div className="text-xs text-muted">Repos</div>
                    </div>
                    <div>
                      <div className="font-display text-lg font-semibold">{user.followers}</div>
                      <div className="text-xs text-muted">Followers</div>
                    </div>
                    <div>
                      <div className="font-display text-lg font-semibold">{user.following}</div>
                      <div className="text-xs text-muted">Following</div>
                    </div>
                  </div>
                </>
              )}
            </Card>
          </RevealOnScroll>

          <RevealOnScroll delay={0.05} className="lg:col-span-2">
            <Card className="p-6">
              <h3 className="mb-4 font-display font-semibold text-accent-2">Recent repositories</h3>
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
                    className="block rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-accent-2"
                  >
                    <p className="truncate text-sm font-medium">{r.name}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted">{r.description || "No description"}</p>
                    <div className="mt-3 flex items-center gap-3 text-xs text-muted">
                      <span className="flex items-center gap-1"><FiStar /> {r.stargazers_count}</span>
                      <span>{r.language || "—"}</span>
                    </div>
                  </a>
                ))}
              </div>
            </Card>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}

