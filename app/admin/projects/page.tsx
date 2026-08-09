"use client";

import { useEffect, useState } from "react";
import {
  HiPlus,
  HiPencilSquare,
  HiTrash,
  HiArrowUp,
  HiArrowDown,
  HiCheck,
  HiExclamationTriangle,
  HiXMark,
  HiStar,
  HiEye,
  HiEyeSlash
} from "react-icons/hi2";

type Project = {
  id: string;
  title: string;
  desc: string;
  tech: string[];
  features: string[];
  challenge: string;
  github: string;
  demo: string;
  gradient: string;
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
};

export default function ProjectsManagerPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tech, setTech] = useState("");
  const [features, setFeatures] = useState("");
  const [challenge, setChallenge] = useState("");
  const [github, setGithub] = useState("");
  const [demo, setDemo] = useState("");
  const [gradient, setGradient] = useState("linear-gradient(135deg, rgba(99,102,241,.35), rgba(139,92,246,.15))");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/admin/projects");
      if (!res.ok) throw new Error("Failed to load projects");
      const data = await res.json();
      setProjects(data);
    } catch (err: any) {
      showToast(err.message || "Failed to load projects", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDesc("");
    setTech("");
    setFeatures("");
    setChallenge("");
    setGithub("");
    setDemo("");
    setGradient("linear-gradient(135deg, rgba(99,102,241,.35), rgba(139,92,246,.15))");
    setIsFeatured(false);
    setIsPublished(true);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEditClick = (p: Project) => {
    setEditingId(p.id);
    setTitle(p.title);
    setDesc(p.desc);
    setTech(p.tech.join(", "));
    setFeatures(p.features.join("\n"));
    setChallenge(p.challenge);
    setGithub(p.github);
    setDemo(p.demo);
    setGradient(p.gradient);
    setIsFeatured(p.isFeatured);
    setIsPublished(p.isPublished);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !desc.trim()) {
      showToast("Title and Description are required.", "error");
      return;
    }

    setSaving(true);
    const techArr = tech.split(",").map((t) => t.trim()).filter(Boolean);
    const featuresArr = features.split("\n").map((f) => f.trim()).filter(Boolean);

    const payload = {
      id: editingId || undefined,
      title: title.trim(),
      desc: desc.trim(),
      tech: techArr,
      features: featuresArr,
      challenge: challenge.trim(),
      github: github.trim(),
      demo: demo.trim(),
      gradient,
      isFeatured,
      isPublished,
    };

    try {
      const res = await fetch("/api/admin/projects", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save project");

      showToast(editingId ? "Project updated successfully!" : "Project created successfully!");
      resetForm();
      fetchProjects();
    } catch (err: any) {
      showToast(err.message || "Failed to save project", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;

    try {
      const res = await fetch(`/api/admin/projects?id=${confirmDeleteId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete project");

      showToast("Project deleted successfully!");
      setConfirmDeleteId(null);
      fetchProjects();
    } catch (err: any) {
      showToast(err.message || "Failed to delete project", "error");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const currentProject = projects[index];
    const targetProject = projects[targetIndex];

    try {
      await Promise.all([
        fetch("/api/admin/projects", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: currentProject.id, displayOrder: targetProject.displayOrder }),
        }),
        fetch("/api/admin/projects", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: targetProject.id, displayOrder: currentProject.displayOrder }),
        }),
      ]);

      fetchProjects();
      showToast("Projects reordered!");
    } catch (err: any) {
      showToast("Failed to reorder projects", "error");
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
            <h3 className="font-display text-lg font-bold text-white mb-2">Delete Project</h3>
            <p className="text-sm text-[#8b93a7] mb-6">
              Are you sure you want to delete this project? This action is permanent and cannot be undone.
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
          <h1 className="font-display text-3xl font-bold text-white">Manage Projects</h1>
          <p className="mt-1 text-sm text-[#8b93a7]">
            Add, update, publish, or rearrange projects on your landing page.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-colors"
          >
            <HiPlus size={16} /> Add Project
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="glass p-6 rounded-2xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="font-display text-lg font-semibold text-white">
              {editingId ? "Edit Project" : "New Project"}
            </h2>
            <button type="button" onClick={resetForm} className="text-[#8b93a7] hover:text-white">
              <HiXMark size={20} />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-[#8b93a7] mb-2">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-[#8b93a7] mb-2">
                Tech Stack (comma separated)
              </label>
              <input
                type="text"
                value={tech}
                onChange={(e) => setTech(e.target.value)}
                placeholder="FastAPI, PostgreSQL, Redis, Docker"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-[#8b93a7] mb-2">
              Short Description *
            </label>
            <input
              type="text"
              required
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-[#8b93a7] mb-2">
                GitHub Repository URL
              </label>
              <input
                type="text"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/username/project"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-[#8b93a7] mb-2">
                Live Demo URL
              </label>
              <input
                type="text"
                value={demo}
                onChange={(e) => setDemo(e.target.value)}
                placeholder="https://project-demo.com"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-[#8b93a7] mb-2">
                Background Gradient
              </label>
              <input
                type="text"
                value={gradient}
                onChange={(e) => setGradient(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex items-center gap-6 pt-6">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-white flex items-center gap-1.5"><HiStar className="text-yellow-400" /> Featured Project</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-white">Publish</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-[#8b93a7] mb-2">
              Key Features (One feature per line)
            </label>
            <textarea
              rows={4}
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              placeholder="Async background jobs via Celery&#10;Role-based access control&#10;Auto-generated OpenAPI docs"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-[#8b93a7] mb-2">
              Challenge Solved
            </label>
            <textarea
              rows={3}
              value={challenge}
              onChange={(e) => setChallenge(e.target.value)}
              placeholder="e.g. Solved N+1 query issues by redesigning the ORM layer, cutting p95 latency by 60%."
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
              {saving ? "Saving..." : "Save Project"}
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
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Tech Stack</th>
                  <th className="px-6 py-4 text-center">Featured</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Reorder</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-xs text-[#8b93a7]">
                      No projects found. Add your first project using the button above.
                    </td>
                  </tr>
                ) : (
                  projects.map((p, idx) => (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span
                            className="h-6 w-6 rounded-md border border-white/15 shadow-sm block shrink-0"
                            style={{ background: p.gradient }}
                          />
                          <p className="font-semibold text-white">{p.title}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {p.tech.slice(0, 3).map((t) => (
                            <span key={t} className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-[#8b93a7]">
                              {t}
                            </span>
                          ))}
                          {p.tech.length > 3 && <span className="text-[10px] text-[#8b93a7]">+{p.tech.length - 3}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {p.isFeatured ? (
                          <HiStar className="text-yellow-400 mx-auto" size={18} />
                        ) : (
                          <span className="text-[#8b93a7]">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          p.isPublished
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-amber-500/10 text-amber-400"
                        }`}>
                          {p.isPublished ? <HiEye size={12} /> : <HiEyeSlash size={12} />}
                          {p.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex gap-1">
                          <button
                            onClick={() => handleMove(idx, "up")}
                            disabled={idx === 0}
                            className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:hover:bg-white/5"
                            aria-label="Move project up"
                          >
                            <HiArrowUp size={14} />
                          </button>
                          <button
                            onClick={() => handleMove(idx, "down")}
                            disabled={idx === projects.length - 1}
                            className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:hover:bg-white/5"
                            aria-label="Move project down"
                          >
                            <HiArrowDown size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(p)}
                            className="p-2 rounded-lg bg-indigo-600/15 hover:bg-indigo-600/30 text-indigo-400 transition-colors"
                            aria-label="Edit project"
                          >
                            <HiPencilSquare size={16} />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(p.id)}
                            className="p-2 rounded-lg bg-red-600/15 hover:bg-red-600/30 text-red-400 transition-colors"
                            aria-label="Delete project"
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
