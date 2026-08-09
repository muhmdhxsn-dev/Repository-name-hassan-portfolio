"use client";

import { useEffect, useState } from "react";
import {
  HiPlus,
  HiPencilSquare,
  HiTrash,
  HiCheck,
  HiExclamationTriangle,
  HiXMark
} from "react-icons/hi2";

type SocialLink = {
  id: string;
  platform: string;
  url: string;
  iconName: string;
  displayOrder: number;
};

export default function SocialLinksManagerPage() {
  const [list, setList] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [iconName, setIconName] = useState("");
  const [saving, setSaving] = useState(false);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchSocials = async () => {
    try {
      const res = await fetch("/api/admin/socials");
      if (!res.ok) throw new Error("Failed to load social links");
      const data = await res.json();
      setList(data);
    } catch (err: any) {
      showToast(err.message || "Failed to load social links", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocials();
  }, []);

  const resetForm = () => {
    setPlatform("");
    setUrl("");
    setIconName("");
    setEditingId(null);
    setShowForm(false);
  };

  const handleEditClick = (social: SocialLink) => {
    setEditingId(social.id);
    setPlatform(social.platform);
    setUrl(social.url);
    setIconName(social.iconName);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!platform.trim() || !url.trim()) {
      showToast("Platform and URL are required.", "error");
      return;
    }

    setSaving(true);
    
    // Automatically infer standard icon names if none provided
    let inferredIcon = iconName.trim();
    if (!inferredIcon) {
      const p = platform.trim().toLowerCase();
      if (p === "github") inferredIcon = "FiGithub";
      else if (p === "linkedin") inferredIcon = "FiLinkedin";
      else if (p === "twitter" || p === "x") inferredIcon = "FiTwitter";
      else if (p === "email" || p === "mail") inferredIcon = "FiMail";
      else inferredIcon = "FiExternalLink";
    }

    try {
      const res = await fetch("/api/admin/socials", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId || undefined,
          platform: platform.trim().toLowerCase(),
          url: url.trim(),
          iconName: inferredIcon,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save social link");

      showToast(editingId ? "Social link updated!" : "Social link added!");
      resetForm();
      fetchSocials();
    } catch (err: any) {
      showToast(err.message || "Failed to save social link", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;

    try {
      const res = await fetch(`/api/admin/socials?id=${confirmDeleteId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete social link");

      showToast("Social link deleted successfully!");
      setConfirmDeleteId(null);
      fetchSocials();
    } catch (err: any) {
      showToast(err.message || "Failed to delete social link", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm shadow-lg border transition-all ${
            toast.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {toast.type === "success" ? <HiCheck /> : <HiExclamationTriangle />}
          {toast.message}
        </div>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="glass max-w-sm w-full rounded-2xl p-6 border border-white/10 relative">
            <h3 className="font-display text-lg font-bold text-white mb-2">Delete Social Link</h3>
            <p className="text-sm text-[#8b93a7] mb-6">
              Are you sure you want to delete this social link? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 text-xs font-medium text-white/70 hover:text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Manage Social Links</h1>
          <p className="mt-1 text-sm text-[#8b93a7]">
            Update your profiles for GitHub, LinkedIn, Twitter/X, and public contact email.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-colors"
          >
            <HiPlus size={16} /> Add Social Link
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="glass p-6 rounded-2xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="font-display text-lg font-semibold text-white">
              {editingId ? "Edit Social Link" : "New Social Link"}
            </h2>
            <button type="button" onClick={resetForm} className="text-[#8b93a7] hover:text-white">
              <HiXMark size={20} />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-[#8b93a7] mb-2">
                Platform Name *
              </label>
              <input
                type="text"
                required
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                placeholder="e.g. github, linkedin, email"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-mono text-xs uppercase tracking-wider text-[#8b93a7] mb-2">
                URL *
              </label>
              <input
                type="text"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="e.g. https://github.com/username or mailto:you@mail.com"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-[#8b93a7] mb-2">
              Icon Class Name (Optional)
            </label>
            <input
              type="text"
              value={iconName}
              onChange={(e) => setIconName(e.target.value)}
              placeholder="e.g. FiGithub, FiLinkedin, FiMail (leave empty for auto-infer)"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-medium text-white hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-indigo-600 px-6 py-2.5 text-xs font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Social"}
            </button>
          </div>
        </form>
      )}

      {!showForm && (
        <div className="glass rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs font-mono uppercase tracking-wider text-[#8b93a7] bg-white/5">
                  <th className="px-6 py-4">Platform</th>
                  <th className="px-6 py-4">URL</th>
                  <th className="px-6 py-4">Icon Name</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {list.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-xs text-[#8b93a7]">
                      No social links added yet.
                    </td>
                  </tr>
                ) : (
                  list.map((social) => (
                    <tr key={social.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-semibold text-white capitalize">{social.platform}</td>
                      <td className="px-6 py-4 text-[#8b93a7] truncate max-w-xs">{social.url}</td>
                      <td className="px-6 py-4 text-[#8b93a7] font-mono text-xs">{social.iconName}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(social)}
                            className="p-2 rounded-lg bg-indigo-600/15 hover:bg-indigo-600/30 text-indigo-400 transition-colors"
                          >
                            <HiPencilSquare size={16} />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(social.id)}
                            className="p-2 rounded-lg bg-red-600/15 hover:bg-red-600/30 text-red-400 transition-colors"
                          >
                            <HiTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
