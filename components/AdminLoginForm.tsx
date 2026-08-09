"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HiArrowLeft, HiEye, HiEyeSlash, HiLockClosed, HiUser } from "react-icons/hi2";

export default function AdminLoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!username.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to sign in.");
      }

      router.push("/admin");
      router.refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#050816] px-4 py-12">
      <div className="absolute left-1/4 top-1/4 h-[300px] w-[300px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-purple-600/10 blur-[100px] pointer-events-none" />

      <div className="glass relative z-10 w-full max-w-md rounded-2xl p-8 shadow-[0_20px_50px_rgba(99,102,241,0.15)]">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xl text-white">
            <HiLockClosed />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-white">Admin Portal</h1>
          <p className="mt-1 text-sm text-[#8b93a7]">Sign in to manage your portfolio content.</p>
        </div>

        {error && (
          <div role="alert" className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="mb-2 block font-mono text-xs uppercase tracking-wider text-[#8b93a7]">
              Username
            </label>
            <div className="relative">
              <HiUser size={16} className="absolute inset-y-0 left-3 my-auto text-[#8b93a7]" />
              <input
                id="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Enter username"
                className="w-full rounded-lg border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-indigo-500 focus:bg-white/10"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block font-mono text-xs uppercase tracking-wider text-[#8b93a7]">
              Password
            </label>
            <div className="relative">
              <HiLockClosed size={16} className="absolute inset-y-0 left-3 my-auto text-[#8b93a7]" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
                className="w-full rounded-lg border border-white/10 bg-white/5 py-3 pl-10 pr-12 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-indigo-500 focus:bg-white/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-3 text-[#8b93a7] transition-colors hover:text-white"
              >
                {showPassword ? <HiEyeSlash size={18} /> : <HiEye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-full bg-indigo-600 px-4 py-3.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Signing In...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <Link href="/" className="mt-6 flex items-center justify-center gap-2 text-xs text-[#8b93a7] transition-colors hover:text-white">
          <HiArrowLeft size={14} />
          Back to portfolio
        </Link>
      </div>
    </div>
  );
}
