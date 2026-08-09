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
  HiArrowUpTray,
  HiArrowTopRightOnSquare
} from "react-icons/hi2";

type Certificate = {
  id: string;
  name: string;
  issuer: string;
  date: string;
  fileUrl: string | null;
  credentialUrl: string | null;
  displayOrder: number;
};

export default function CertificatesManagerPage() {
  const [list, setList] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [issuer, setIssuer] = useState("");
  const [date, setDate] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCertificates = async () => {
    try {
      const res = await fetch("/api/admin/certificates");
      if (!res.ok) throw new Error("Failed to load certificates");
      const data = await res.json();
      setList(data);
    } catch (err: any) {
      showToast(err.message || "Failed to load certificates", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const resetForm = () => {
    setName("");
    setIssuer("");
    setDate("");
    setFileUrl("");
    setCredentialUrl("");
    setEditingId(null);
    setShowForm(false);
  };

  const handleEditClick = (cert: Certificate) => {
    setEditingId(cert.id);
    setName(cert.name);
    setIssuer(cert.issuer);
    setDate(cert.date);
    setFileUrl(cert.fileUrl || "");
    setCredentialUrl(cert.credentialUrl || "");
    setShowForm(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "certificate");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "File upload failed");

      setFileUrl(data.url);
      showToast("Certificate document uploaded!");
    } catch (err: any) {
      showToast(err.message || "Failed to upload file", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !issuer.trim() || !date.trim()) {
      showToast("Name, issuer and date are required.", "error");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/admin/certificates", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId || undefined,
          name: name.trim(),
          issuer: issuer.trim(),
          date: date.trim(),
          fileUrl: fileUrl || null,
          credentialUrl: credentialUrl || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save certificate");

      showToast(editingId ? "Certificate updated successfully!" : "Certificate added successfully!");
      resetForm();
      fetchCertificates();
    } catch (err: any) {
      showToast(err.message || "Failed to save certificate", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;

    try {
      const res = await fetch(`/api/admin/certificates?id=${confirmDeleteId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete certificate");

      showToast("Certificate deleted successfully!");
      setConfirmDeleteId(null);
      fetchCertificates();
    } catch (err: any) {
      showToast(err.message || "Failed to delete certificate", "error");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const currentCert = list[index];
    const targetCert = list[targetIndex];

    try {
      await Promise.all([
        fetch("/api/admin/certificates", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: currentCert.id, displayOrder: targetCert.displayOrder }),
        }),
        fetch("/api/admin/certificates", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: targetCert.id, displayOrder: currentCert.displayOrder }),
        }),
      ]);

      fetchCertificates();
      showToast("Certificates reordered!");
    } catch (err: any) {
      showToast("Failed to reorder certificates", "error");
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
            <h3 className="font-display text-lg font-bold text-white mb-2">Delete Certificate</h3>
            <p className="text-sm text-[#8b93a7] mb-6">
              Are you sure you want to delete this certificate? This action cannot be undone.
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
          <h1 className="font-display text-3xl font-bold text-white">Manage Certificates</h1>
          <p className="mt-1 text-sm text-[#8b93a7]">
            Add or update your training milestones, licenses, and verified badges.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-colors"
          >
            <HiPlus size={16} /> Add Certificate
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="glass p-6 rounded-2xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="font-display text-lg font-semibold text-white">
              {editingId ? "Edit Certificate" : "New Certificate"}
            </h2>
            <button type="button" onClick={resetForm} className="text-[#8b93a7] hover:text-white">
              <HiXMark size={20} />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-[#8b93a7] mb-2">
                Certificate Name *
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
                Issuing Organization *
              </label>
              <input
                type="text"
                required
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                placeholder="e.g. Google Cloud, Coursera, AWS"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-[#8b93a7] mb-2">
                Date Earned *
              </label>
              <input
                type="text"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. Nov 2024"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-mono text-xs uppercase tracking-wider text-[#8b93a7] mb-2">
                Verification / Credential URL
              </label>
              <input
                type="text"
                value={credentialUrl}
                onChange={(e) => setCredentialUrl(e.target.value)}
                placeholder="https://verify.org/id/..."
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-[#8b93a7] mb-2">
              Certificate Copy (PDF / Image)
            </label>
            <div className="flex gap-4 items-center">
              <input
                type="text"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="Upload certificate or input custom URL"
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
              />
              <label className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-white hover:bg-white/10 cursor-pointer disabled:opacity-50 shrink-0">
                <HiArrowUpTray />
                {uploading ? "Uploading..." : "Upload File"}
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
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
              {saving ? "Saving..." : "Save Certificate"}
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
                  <th className="px-6 py-4">Certificate Name</th>
                  <th className="px-6 py-4">Issuer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-center">Docs</th>
                  <th className="px-6 py-4 text-center">Reorder</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {list.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-xs text-[#8b93a7]">
                      No certificates added yet. Add one using the button above.
                    </td>
                  </tr>
                ) : (
                  list.map((cert, idx) => (
                    <tr key={cert.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-semibold text-white">{cert.name}</td>
                      <td className="px-6 py-4 text-[#8b93a7]">{cert.issuer}</td>
                      <td className="px-6 py-4 text-[#8b93a7]">{cert.date}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          {cert.credentialUrl && (
                            <a
                              href={cert.credentialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-400 hover:text-indigo-300"
                              title="Verify Credential"
                            >
                              <HiArrowTopRightOnSquare size={16} />
                            </a>
                          )}
                          {cert.fileUrl && (
                            <a
                              href={cert.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-400 hover:text-emerald-300"
                              title="View Document"
                            >
                              <HiArrowUpTray size={16} />
                            </a>
                          )}
                        </div>
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
                            onClick={() => handleEditClick(cert)}
                            className="p-2 rounded-lg bg-indigo-600/15 hover:bg-indigo-600/30 text-indigo-400 transition-colors"
                          >
                            <HiPencilSquare size={16} />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(cert.id)}
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
