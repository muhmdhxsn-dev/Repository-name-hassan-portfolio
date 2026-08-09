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
  HiXMark
} from "react-icons/hi2";

type Skill = {
  id: string;
  category: string;
  items: string[];
  displayOrder: number;
};

export default function SkillsManagerPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [items, setItems] = useState("");
  const [saving, setSaving] = useState(false);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/admin/skills");
      if (!res.ok) throw new Error("Failed to load skills");
      const data = await res.json();
      setSkills(data);
    } catch (err: any) {
      showToast(err.message || "Failed to load skills", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const resetForm = () => {
    setCategory("");
    setItems("");
    setEditingId(null);
    setShowForm(false);
  };

  const handleEditClick = (s: Skill) => {
    setEditingId(s.id);
    setCategory(s.category);
    setItems(s.items.join(", "));
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category.trim() || !items.trim()) {
      showToast("Category and items are required.", "error");
      return;
    }

    setSaving(true);
    const itemsArr = items.split(",").map((i) => i.trim()).filter(Boolean);

    try {
      const res = await fetch("/api/admin/skills", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId || undefined,
          category: category.trim(),
          items: itemsArr,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save skill category");

      showToast(editingId ? "Skills updated successfully!" : "Skills category added successfully!");
      resetForm();
      fetchSkills();
    } catch (err: any) {
      showToast(err.message || "Failed to save skills", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;

    try {
      const res = await fetch(`/api/admin/skills?id=${confirmDeleteId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete skill category");

      showToast("Skill category deleted successfully!");
      setConfirmDeleteId(null);
      fetchSkills();
    } catch (err: any) {
      showToast(err.message || "Failed to delete skills", "error");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= skills.length) return;

    const currentSkill = skills[index];
    const targetSkill = skills[targetIndex];

    try {
      await Promise.all([
        fetch("/api/admin/skills", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: currentSkill.id, displayOrder: targetSkill.displayOrder }),
        }),
        fetch("/api/admin/skills", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: targetSkill.id, displayOrder: currentSkill.displayOrder }),
        }),
      ]);

      fetchSkills();
      showToast("Skill categories reordered!");
    } catch (err: any) {
      showToast("Failed to reorder skills", "error");
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
            <h3 className="font-display text-lg font-bold text-white mb-2">Delete Skill Category</h3>
            <p className="text-sm text-[#8b93a7] mb-6">
              Are you sure you want to delete this skill category and all its items? This action cannot be undone.
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
          <h1 className="font-display text-3xl font-bold text-white">Manage Skills</h1>
          <p className="mt-1 text-sm text-[#8b93a7]">
            Update, categorize, and prioritize the technical skills displayed in the portfolio.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-colors"
          >
            <HiPlus size={16} /> Add Category
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="glass p-6 rounded-2xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="font-display text-lg font-semibold text-white">
              {editingId ? "Edit Skill Category" : "New Skill Category"}
            </h2>
            <button type="button" onClick={resetForm} className="text-[#8b93a7] hover:text-white">
              <HiXMark size={20} />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <label className="block font-mono text-xs uppercase tracking-wider text-[#8b93a7] mb-2">
                Category Name *
              </label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Backend, DevOps"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-mono text-xs uppercase tracking-wider text-[#8b93a7] mb-2">
                Skills list (comma separated) *
              </label>
              <input
                type="text"
                required
                value={items}
                onChange={(e) => setItems(e.target.value)}
                placeholder="e.g. FastAPI, Django, Flask"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>
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
              {saving ? "Saving..." : "Save Category"}
            </button>
          </div>
        </form>
      )}

      {!showForm && (
        <div className="grid gap-4 sm:grid-cols-2">
          {skills.length === 0 ? (
            <p className="sm:col-span-2 text-center text-xs text-[#8b93a7] py-12">
              No skill categories found. Add your first category using the button above.
            </p>
          ) : (
            skills.map((s, idx) => (
              <div
                key={s.id}
                className="glass p-6 rounded-2xl border border-white/10 hover:border-indigo-500/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <h3 className="font-display font-semibold text-indigo-400">{s.category}</h3>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleMove(idx, "up")}
                        disabled={idx === 0}
                        className="p-1 rounded bg-white/5 hover:bg-white/10 text-white disabled:opacity-30"
                        title="Move Up"
                      >
                        <HiArrowUp size={12} />
                      </button>
                      <button
                        onClick={() => handleMove(idx, "down")}
                        disabled={idx === skills.length - 1}
                        className="p-1 rounded bg-white/5 hover:bg-white/10 text-white disabled:opacity-30"
                        title="Move Down"
                      >
                        <HiArrowDown size={12} />
                      </button>
                    </div>
                  </div>
                  <ul className="flex flex-wrap gap-2 text-xs">
                    {s.items.map((it) => (
                      <li
                        key={it}
                        className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[#f5f6fa]/80"
                      >
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-white/5">
                  <button
                    onClick={() => handleEditClick(s)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/25 rounded-lg transition-colors"
                  >
                    <HiPencilSquare size={14} /> Edit
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(s.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/25 rounded-lg transition-colors"
                  >
                    <HiTrash size={14} /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
