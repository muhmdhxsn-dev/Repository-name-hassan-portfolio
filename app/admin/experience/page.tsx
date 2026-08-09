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

type Experience = {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  description: string;
  isCurrent: boolean;
  displayOrder: number;
};

export default function ExperienceManagerPage() {
  const [list, setList] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [isCurrent, setIsCurrent] = useState(false);
  const [saving, setSaving] = useState(false);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchExperience = async () => {
    try {
      const res = await fetch("/api/admin/experience");
      if (!res.ok) throw new Error("Failed to load experience items");
      const data = await res.json();
      setList(data);
    } catch (err: any) {
      showToast(err.message || "Failed to load experience items", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperience();
  }, []);

  const resetForm = () => {
    setCompany("");
    setRole("");
    setStartDate("");
    setEndDate("");
    setDescription("");
    setIsCurrent(false);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEditClick = (exp: Experience) => {
    setEditingId(exp.id);
    setCompany(exp.company);
    setRole(exp.role);
    setStartDate(exp.startDate);
    setEndDate(exp.endDate || "");
    setDescription(exp.description);
    setIsCurrent(exp.isCurrent);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim() || !startDate.trim()) {
      showToast("Company, role and start date are required.", "error");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/admin/experience", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId || undefined,
          company: company.trim(),
          role: role.trim(),
          startDate: startDate.trim(),
          endDate: isCurrent ? null : endDate.trim(),
          description: description.trim(),
          isCurrent,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save experience entry");

      showToast(editingId ? "Experience updated successfully!" : "Experience added successfully!");
      resetForm();
      fetchExperience();
    } catch (err: any) {
      showToast(err.message || "Failed to save experience", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;

    try {
      const res = await fetch(`/api/admin/experience?id=${confirmDeleteId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete experience entry");

      showToast("Experience entry deleted successfully!");
      setConfirmDeleteId(null);
      fetchExperience();
    } catch (err: any) {
      showToast(err.message || "Failed to delete experience", "error");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const currentExp = list[index];
    const targetExp = list[targetIndex];

    try {
      await Promise.all([
        fetch("/api/admin/experience", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: currentExp.id, displayOrder: targetExp.displayOrder }),
        }),
        fetch("/api/admin/experience", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: targetExp.id, displayOrder: currentExp.displayOrder }),
        }),
      ]);

      fetchExperience();
      showToast("Timeline reordered!");
    } catch (err: any) {
      showToast("Failed to reorder timeline", "error");
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
            <h3 className="font-display text-lg font-bold text-white mb-2">Delete Experience</h3>
            <p className="text-sm text-[#8b93a7] mb-6">
              Are you sure you want to delete this experience entry? This action cannot be undone.
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
          <h1 className="font-display text-3xl font-bold text-white">Manage Experience</h1>
          <p className="mt-1 text-sm text-[#8b93a7]">
            Add or update items in your professional work history timeline.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-colors"
          >
            <HiPlus size={16} /> Add Experience
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="glass p-6 rounded-2xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="font-display text-lg font-semibold text-white">
              {editingId ? "Edit Experience Entry" : "New Experience Entry"}
            </h2>
            <button type="button" onClick={resetForm} className="text-[#8b93a7] hover:text-white">
              <HiXMark size={20} />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-[#8b93a7] mb-2">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-[#8b93a7] mb-2">
                Job Role *
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Senior Backend Engineer"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-[#8b93a7] mb-2">
                Start Date *
              </label>
              <input
                type="text"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="e.g. Jan 2024"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-[#8b93a7] mb-2">
                End Date
              </label>
              <input
                type="text"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={isCurrent}
                placeholder="e.g. Dec 2025"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500 disabled:opacity-30"
              />
            </div>
            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isCurrent}
                  onChange={(e) => setIsCurrent(e.target.checked)}
                  className="rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-white">Current Job</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-[#8b93a7] mb-2">
              Role Description / Tasks
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your responsibilities, achievements, and tech used."
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
              {saving ? "Saving..." : "Save Entry"}
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
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4 text-center">Reorder</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {list.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-xs text-[#8b93a7]">
                      No work experience added yet. Add one using the button above.
                    </td>
                  </tr>
                ) : (
                  list.map((exp, idx) => (
                    <tr key={exp.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-semibold text-white">{exp.company}</td>
                      <td className="px-6 py-4 text-[#8b93a7]">{exp.role}</td>
                      <td className="px-6 py-4 text-[#8b93a7]">
                        {exp.startDate} &mdash; {exp.isCurrent ? "Present" : exp.endDate}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex gap-1">
                          <button
                            onClick={() => handleMove(idx, "up")}
                            disabled={idx === 0}
                            className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white disabled:opacity-30"
                          >
                            <HiArrowUp size={14} />
                          </button>
                          <button
                            onClick={() => handleMove(idx, "down")}
                            disabled={idx === list.length - 1}
                            className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white disabled:opacity-30"
                          >
                            <HiArrowDown size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(exp)}
                            className="p-2 rounded-lg bg-indigo-600/15 hover:bg-indigo-600/30 text-indigo-400 transition-colors"
                          >
                            <HiPencilSquare size={16} />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(exp.id)}
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
