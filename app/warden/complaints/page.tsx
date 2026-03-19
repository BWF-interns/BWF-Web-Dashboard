/**
 * Complaints page — view and manage student complaints.
 * Filter by status. Resolve or escalate open complaints.
 */
"use client";
import { useEffect, useState, useCallback } from "react";

interface Complaint {
  _id: string;
  student_id: { _id: string; name: string } | string;
  message: string; status: string; is_anonymous: boolean; createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  OPEN: "bg-yellow-100 text-yellow-700",
  RESOLVED: "bg-green-100 text-green-700",
  ESCALATED: "bg-purple-100 text-purple-700",
};

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchComplaints = useCallback(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (status) params.set("status", status);
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/warden/complaints?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => { setComplaints(data.complaints || []); setPages(data.pages || 1); })
      .catch(() => setError("Failed to load complaints."))
      .finally(() => setLoading(false));
  }, [page, status]);

  useEffect(() => { fetchComplaints(); }, [fetchComplaints]);

  const handleAction = async (id: string, action: "resolve" | "escalate") => {
    const token = localStorage.getItem("token");
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/warden/complaints/${id}/${action}`, {
      method: "PUT", headers: { Authorization: `Bearer ${token}` },
    });
    fetchComplaints();
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Complaints</h1>
        <p className="text-gray-500 mt-1">Manage student complaints</p>
      </div>

      <div className="flex gap-2">
        {["", "OPEN", "RESOLVED", "ESCALATED"].map((s) => (
          <button key={s} onClick={() => { setStatus(s); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${status === s ? "bg-blue-600 text-white border-blue-600" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
            {s || "All"}
          </button>
        ))}
      </div>

      {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>
      ) : (
        <div className="space-y-3">
          {complaints.length === 0 ? (
            <div className="border rounded-lg p-10 text-center text-gray-400">No complaints found</div>
          ) : complaints.map((c) => {
            const name = typeof c.student_id === "object" ? c.student_id.name : "—";
            return (
              <div key={c._id} className="border rounded-lg p-4 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{name}</span>
                      {c.is_anonymous && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Anonymous</span>}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[c.status] || ""}`}>{c.status}</span>
                    </div>
                    <p className="text-sm text-gray-700">{c.message}</p>
                    <p className="text-xs text-gray-400 mt-2">{new Date(c.createdAt).toLocaleString()}</p>
                  </div>
                  {c.status === "OPEN" && (
                    <div className="flex flex-col gap-2">
                      <button onClick={() => handleAction(c._id, "resolve")} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">Resolve</button>
                      <button onClick={() => handleAction(c._id, "escalate")} className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">Escalate</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {pages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => setPage(page - 1)} disabled={page === 1} className="px-3 py-1 border rounded text-sm disabled:opacity-40">Previous</button>
          <span className="text-sm text-gray-600">Page {page} of {pages}</span>
          <button onClick={() => setPage(page + 1)} disabled={page === pages} className="px-3 py-1 border rounded text-sm disabled:opacity-40">Next</button>
        </div>
      )}
    </div>
  );
}
