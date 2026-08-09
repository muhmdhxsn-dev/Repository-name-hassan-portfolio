"use client";

import { useEffect, useState } from "react";
import {
  HiTrash,
  HiCheck,
  HiExclamationTriangle,
  HiEnvelope,
  HiEnvelopeOpen,
  HiXMark
} from "react-icons/hi2";

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function MessagesManagerPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/admin/messages");
      if (!res.ok) throw new Error("Failed to load messages");
      const data = await res.json();
      setMessages(data);
    } catch (err: any) {
      showToast(err.message || "Failed to load messages", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const toggleRead = async (msg: Message) => {
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: msg.id, isRead: !msg.isRead }),
      });

      if (!res.ok) throw new Error("Failed to update message status");
      
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, isRead: !msg.isRead } : m))
      );
      if (selectedMessage && selectedMessage.id === msg.id) {
        setSelectedMessage({ ...selectedMessage, isRead: !msg.isRead });
      }

      showToast(msg.isRead ? "Marked as unread" : "Marked as read");
    } catch (err: any) {
      showToast(err.message || "Error updating message", "error");
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;

    try {
      const res = await fetch(`/api/admin/messages?id=${confirmDeleteId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete message");

      showToast("Message deleted successfully!");
      if (selectedMessage && selectedMessage.id === confirmDeleteId) {
        setSelectedMessage(null);
      }
      setConfirmDeleteId(null);
      fetchMessages();
    } catch (err: any) {
      showToast(err.message || "Error deleting message", "error");
    }
  };

  const openMessage = (msg: Message) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      toggleRead(msg);
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
            <h3 className="font-display text-lg font-bold text-white mb-2">Delete Message</h3>
            <p className="text-sm text-[#8b93a7] mb-6">
              Are you sure you want to delete this message? This action is permanent and cannot be undone.
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

      {selectedMessage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] flex items-center justify-center p-4">
          <div className="glass max-w-lg w-full rounded-2xl border border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-white/5">
              <div>
                <h3 className="font-semibold text-white truncate">{selectedMessage.name}</h3>
                <p className="text-xs text-[#8b93a7] truncate">{selectedMessage.email}</p>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-[#8b93a7] hover:text-white"
              >
                <HiXMark size={22} />
              </button>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              <p className="text-xs font-mono text-[#8b93a7]">
                Received on: {new Date(selectedMessage.createdAt).toLocaleString()}
              </p>
              <div className="border border-white/5 bg-white/5 p-4 rounded-xl text-sm leading-relaxed text-[#f5f6fa]/90 whitespace-pre-wrap">
                {selectedMessage.message}
              </div>
            </div>

            <div className="flex justify-between items-center gap-3 border-t border-white/10 px-6 py-4 bg-white/5">
              <button
                onClick={() => toggleRead(selectedMessage)}
                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/25 px-3.5 py-2 rounded-xl transition-colors"
              >
                {selectedMessage.isRead ? <HiEnvelope size={14} /> : <HiEnvelopeOpen size={14} />}
                {selectedMessage.isRead ? "Mark Unread" : "Mark Read"}
              </button>
              <button
                onClick={() => setConfirmDeleteId(selectedMessage.id)}
                className="flex items-center gap-1.5 text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/25 px-3.5 py-2 rounded-xl transition-colors"
              >
                <HiTrash size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="font-display text-3xl font-bold text-white">Contact Messages</h1>
        <p className="mt-1 text-sm text-[#8b93a7]">
          View and manage the messages submitted from your public portfolio.
        </p>
      </div>

      <div className="glass rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs font-mono uppercase tracking-wider text-[#8b93a7] bg-white/5">
                <th className="px-6 py-4 text-center w-12">Status</th>
                <th className="px-6 py-4">Sender</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Message Snippet</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {messages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-xs text-[#8b93a7]">
                    No messages received yet.
                  </td>
                </tr>
              ) : (
                messages.map((msg) => (
                  <tr
                    key={msg.id}
                    className={`hover:bg-white/5 transition-colors cursor-pointer ${
                      !msg.isRead ? "bg-indigo-500/[0.03] font-medium" : ""
                    }`}
                    onClick={() => openMessage(msg)}
                  >
                    <td className="px-6 py-4 text-center" onClick={(e) => { e.stopPropagation(); toggleRead(msg); }}>
                      <button
                        className={msg.isRead ? "text-[#8b93a7]" : "text-indigo-400"}
                        title={msg.isRead ? "Mark Unread" : "Mark Read"}
                      >
                        {msg.isRead ? <HiEnvelopeOpen size={16} /> : <HiEnvelope size={16} />}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-white font-semibold truncate max-w-[150px]">{msg.name}</td>
                    <td className="px-6 py-4 text-[#8b93a7] truncate max-w-[180px]">{msg.email}</td>
                    <td className="px-6 py-4 text-[#8b93a7]/80 truncate max-w-xs">{msg.message}</td>
                    <td className="px-6 py-4 text-[#8b93a7] text-xs font-mono">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setConfirmDeleteId(msg.id)}
                          className="p-2 rounded-lg bg-red-600/15 hover:bg-red-600/30 text-red-400 transition-colors"
                          title="Delete message"
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
    </div>
  );
}
