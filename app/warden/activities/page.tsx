/**
 * Activities page — lists all student activities for the warden.
 * Filter by status. Approve or reject with an optional comment.
 */
"use client";
import { useEffect, useState, useCallback } from "react";

interface Activity {
  _id: string;
  student_id: { _id: string; name: string } | string;
  type: string; hours: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  comments: string; createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<{ id: string; action: "approve" | "reject" } | null>(null);

  const fetchActivities = useCallback(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (status) params.set("status", status);
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/warden/activities?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => { setActivities(data.activities || []); setPages(data.pages || 1); })
      .catch(() => setError("Failed to load activities."))
      .finally(() => setLoading(false));
  }, [page, status]);

  useEffect(() => { fetchActivities(); }, [fetchActivities]);

  const handleAction = async (id: string, action: "approve" | "reject", comments = "") => {
    const token = localStorage.getItem("token");
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/warden/activities/${id}/${action}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ comments }),
    });
    setModal(null);
    fetchActivities();
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Activities</h1>
        <p className="text-gray-500 mt-1">Review and approve student activities</p>
      </div>

      <div className="flex gap-2">
        {["", "PENDING", "APPROVED", "REJECTED"].map((s) => (
          <button key={s} onClick={() => { setStatus(s); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${status === s ? "bg-blue-600 text-white border-blue-600" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
            {s || "All"}
          </button>
        ))}
      </div>

      {modal && (
        <CommentModal action={modal.action}
          onConfirm={(c) => handleAction(modal.id, modal.action, c)}
          onClose={() => setModal(null)} />
      )}

      {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>
      ) : (
        <div className="border rounded-lg overflow-hidden shadow">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {["Student", "Activity", "Hours", "Status", "Date", "Actions"].map((h) => (
                  <th key={h} className="text-left px-6 py-3 font-medium text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {activities.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400">No activities found</td></tr>
              ) : activities.map((a) => {
                const name = typeof a.student_id === "object" ? a.student_id.name : "—";
                return (
                  <tr key={a._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{name}</td>
                    <td className="px-6 py-4">{a.type}</td>
                    <td className="px-6 py-4">{a.hours}h</td>
                    <td className="px-6 py-4"><span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[a.status]}`}>{a.status}</span></td>
                    <td className="px-6 py-4 text-gray-500">{new Date(a.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      {a.status === "PENDING" && (
                        <div className="flex gap-2">
                          <button onClick={() => setModal({ id: a._id, action: "approve" })} className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700">Approve</button>
                          <button onClick={() => setModal({ id: a._id, action: "reject" })} className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700">Reject</button>
                        </div>
                      )}
                      {a.comments && <p className="text-xs text-gray-400 mt-1 italic">{a.comments}</p>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {pages > 1 && (
            <div className="flex items-center justify-center gap-3 px-6 py-4 border-t">
              <button onClick={() => setPage(page - 1)} disabled={page === 1} className="px-3 py-1 border rounded text-sm disabled:opacity-40">Previous</button>
              <span className="text-sm text-gray-600">Page {page} of {pages}</span>
              <button onClick={() => setPage(page + 1)} disabled={page === pages} className="px-3 py-1 border rounded text-sm disabled:opacity-40">Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CommentModal({ action, onConfirm, onClose }: { action: string; onConfirm: (c: string) => void; onClose: () => void }) {
  const [comment, setComment] = useState("");
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h3 className="font-semibold text-gray-900 mb-3 capitalize">{action} Activity</h3>
        <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none h-24" placeholder="Add a comment (optional)..." value={comment} onChange={(e) => setComment(e.target.value)} />
        <div className="flex gap-3 mt-4 justify-end">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
          <button onClick={() => onConfirm(comment)} className={`px-4 py-2 text-white rounded-lg text-sm ${action === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}>
            Confirm {action}
          </button>
        </div>
      </div>
    </div>
  );
}
