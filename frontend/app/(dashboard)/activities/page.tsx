"use client";
import { useState } from "react";
import useSWR from "swr";
import api from "@/lib/api";
import { Activity } from "@/lib/types";
import { StatusBadge, Pagination } from "@/components/UI";
import toast from "react-hot-toast";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

const fetcher = (url: string) => api.get(url).then((r) => r.data);

export default function ActivitiesPage() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [commentModal, setCommentModal] = useState<{ id: string; action: "approve" | "reject" } | null>(null);

  const params = new URLSearchParams({ page: String(page), limit: "20" });
  if (status) params.set("status", status);

  const { data, isLoading, error, mutate } = useSWR(`/warden/activities?${params}`, fetcher);
  const activities: Activity[] = data?.activities || [];

  const handleAction = async (id: string, action: "approve" | "reject", comments = "") => {
    try {
      await api.put(`/warden/activities/${id}/${action}`, { comments });
      toast.success(`Activity ${action}d`);
      mutate();
    } catch {
      toast.error("Action failed");
    }
    setCommentModal(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Activities</h1>
        <p className="text-gray-500 mt-1">Review and approve student activities</p>
      </div>

      <div className="flex gap-2">
        {["", "PENDING", "APPROVED", "REJECTED"].map((s) => (
          <button
            key={s}
            onClick={() => { setStatus(s); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              status === s ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      {commentModal && (
        <CommentModal
          action={commentModal.action}
          onConfirm={(c) => handleAction(commentModal.id, commentModal.action, c)}
          onClose={() => setCommentModal(null)}
        />
      )}

      {error ? (
        <div className="card flex items-center gap-3 text-red-600 bg-red-50 border-red-200">
          <AlertCircle size={18} />
          <p className="text-sm">Failed to load activities. Please refresh the page.</p>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Student</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Activity</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Hours</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Date</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {activities.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400">No activities found</td></tr>
              ) : activities.map((a) => {
                const studentName = typeof a.student_id === "object" ? a.student_id.name : "—";
                return (
                  <tr key={a._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{studentName}</td>
                    <td className="px-6 py-4">{a.type}</td>
                    <td className="px-6 py-4">{a.hours}h</td>
                    <td className="px-6 py-4"><StatusBadge status={a.status} /></td>
                    <td className="px-6 py-4 text-gray-500">{new Date(a.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      {a.status === "PENDING" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setCommentModal({ id: a._id, action: "approve" })}
                            className="flex items-center gap-1 btn-success py-1 px-3 text-xs"
                          >
                            <CheckCircle size={14} /> Approve
                          </button>
                          <button
                            onClick={() => setCommentModal({ id: a._id, action: "reject" })}
                            className="flex items-center gap-1 btn-danger py-1 px-3 text-xs"
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        </div>
                      )}
                      {a.comments && <p className="text-xs text-gray-400 mt-1 italic">{a.comments}</p>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="px-6 py-4 border-t border-gray-100">
            <Pagination page={page} pages={data?.pages || 1} onPageChange={setPage} />
          </div>
        </div>
      )}
    </div>
  );
}

function CommentModal({ action, onConfirm, onClose }: {
  action: "approve" | "reject"; onConfirm: (c: string) => void; onClose: () => void;
}) {
  const [comment, setComment] = useState("");
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h3 className="font-semibold text-gray-900 mb-3 capitalize">{action} Activity</h3>
        <textarea
          className="input resize-none h-24"
          placeholder="Add a comment (optional)..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="flex gap-3 mt-4 justify-end">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button
            onClick={() => onConfirm(comment)}
            className={action === "approve" ? "btn-success" : "btn-danger"}
          >
            Confirm {action}
          </button>
        </div>
      </div>
    </div>
  );
}
