"use client";

import { useEffect, useState } from "react";
import { HiArrowUpTray, HiCheck, HiExclamationTriangle } from "react-icons/hi2";

export default function EditHeroPage() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [typingText, setTypingText] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [profileImage, setProfileImage] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    async function loadHero() {
      try {
        const res = await fetch("/api/admin/hero");
        if (!res.ok) throw new Error("Failed to load hero content");
        const data = await res.json();
        setName(data.name || "");
        setTitle(data.title || "");
        setSubtitle(data.subtitle || "");
        setTypingText(data.typingText ? data.typingText.join(", ") : "");
        setGithubUsername(data.githubUsername || "octocat");
        setProfileImage(data.profileImage || "");
      } catch (err: any) {
        showToast(err.message || "Failed to load hero content", "error");
      } finally {
        setLoading(false);
      }
    }
    loadHero();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    if (!name.trim() || !title.trim() || !subtitle.trim() || !typingText.trim()) {
      showToast("Please fill in all required fields.", "error");
      setSaving(false);
      return;
    }

    const typingArr = typingText
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      const res = await fetch("/api/admin/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          title: title.trim(),
          subtitle: subtitle.trim(),
          typingText: typingArr,
          profileImage: profileImage || null,
          githubUsername: githubUsername.trim() || "octocat",
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save hero content");
      }

      showToast("Hero content updated successfully!");
    } catch (err: any) {
      showToast(err.message || "Error saving hero content", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please upload an image file (PNG, JPG, WEBP).", "error");
      return;
    }

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "image");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Image upload failed");

      setProfileImage(data.url);
      showToast("Profile image uploaded successfully!");
    } catch (err: any) {
      showToast(err.message || "Failed to upload image", "error");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      showToast("Please upload a PDF file for your resume.", "error");
      return;
    }

    setUploadingResume(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "resume");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Resume upload failed");

      showToast("Resume PDF updated successfully!");
    } catch (err: any) {
      showToast(err.message || "Failed to upload resume", "error");
    } finally {
      setUploadingResume(false);
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

      <div>
        <h1 className="font-display text-3xl font-bold text-white">Edit Hero Section</h1>
        <p className="mt-1 text-sm text-[#8b93a7]">
          Update the profile details, titles, and download assets displayed on the home page.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={handleSave} className="lg:col-span-2 glass p-6 rounded-2xl border border-white/10 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-[#8b93a7] mb-2">
                Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-[#8b93a7] mb-2">
                Availability Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Available for backend roles"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-[#8b93a7] mb-2">
              Typing Roles (Typewriter Text, comma separated)
            </label>
            <input
              type="text"
              required
              value={typingText}
              onChange={(e) => setTypingText(e.target.value)}
              placeholder="Python Developer, Backend Engineer, API Developer"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
            />
            <p className="mt-1.5 text-xs text-[#8b93a7]">Separate multiple phrases with commas.</p>
          </div>

          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-[#8b93a7] mb-2">
              GitHub Username
            </label>
            <input
              type="text"
              required
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
            />
            <p className="mt-1.5 text-xs text-[#8b93a7]">Powers the live Github dashboard feed.</p>
          </div>

          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-[#8b93a7] mb-2">
              Biography / Description
            </label>
            <textarea
              required
              rows={5}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-white/5">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Hero Settings"}
            </button>
          </div>
        </form>

        <div className="space-y-6">
          <div className="glass p-6 rounded-2xl border border-white/10">
            <h2 className="font-display text-lg font-semibold text-white mb-4">Profile Image</h2>
            <div className="flex flex-col items-center gap-4">
              <div className="h-32 w-32 rounded-full border border-white/15 bg-white/5 flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xs text-[#8b93a7]">No Profile Image</span>
                )}
              </div>
              
              <label className="w-full flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-white hover:bg-white/10 cursor-pointer disabled:opacity-50">
                <HiArrowUpTray />
                {uploadingImage ? "Uploading..." : "Upload Image"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
              <p className="text-[10px] text-[#8b93a7] text-center">PNG, JPG, WEBP formats allowed.</p>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl border border-white/10">
            <h2 className="font-display text-lg font-semibold text-white mb-2">Resume (PDF)</h2>
            <p className="text-xs text-[#8b93a7] mb-4">
              Replace the current download file (/public/resume.pdf) without editing code.
            </p>
            <div className="flex flex-col gap-3">
              <label className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-white hover:bg-white/10 cursor-pointer disabled:opacity-50">
                <HiArrowUpTray />
                {uploadingResume ? "Replacing PDF..." : "Upload Resume (PDF)"}
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleResumeUpload}
                  disabled={uploadingResume}
                  className="hidden"
                />
              </label>
              <p className="text-[10px] text-[#8b93a7] text-center">PDF file only. Overwrites existing file.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
