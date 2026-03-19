/**
 * Complaints page — view and manage student complaints.
 * Filter by status. Resolve or escalate open complaints.
 * Anonymous complaints show "Anonymous" instead of student name.
 */
"use client";
import { useState } from "react";
import useSWR from "swr";
import api from "@/services/api";
import { Complaint } from "@/modules/warden/types";
import { StatusBadge, Pagination } from "@/modules/warden/components/UI";
import toast from "react-hot-toast";
import { CheckCircle, ArrowUpCircle, AlertCircle } from "lucide-react";

const fetcher = (url: string) => api.get(url).then((r) => r.data);

export default function ComplaintsPage() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const params = new URLSearchParams({ page: String(page), limit: "20" });
  if (status) params.set("status", status);

  const { data, isLoading, error, mutate } = useSWR(`/warden/complaints?${params}`, fetcher);
  const complaints: Complaint[] = data?.complaints || [];

  const handleAction = async (id: string, action: "resolve" | "escalate") => {
    try {
      await api.put(`/warden/complaints/${id}/${action}`);
      toast.success(`Complaint ${action === "resolve" ? "resolved" : "escalated to admin"}`);
      mutate();
    } catch { toast.error("Action failed"); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Complaints</h1>
        <p className="text-gray-500 mt-1">Manage student complaints</p>
      </div>

      <div className="flex gap-2">
        {["", "OPEN", "RESOLVED", "ESCALATED"].map((s) => (
          <button key={s} onClick={() => { setStatus(s); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${status === s ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
            {s || "All"}
          </button>
        ))}
      </div>

      {error ? (
        <div className="card flex items-center gap-3 text-red-600 bg-red-50 border-red-200">
          <AlertCircle size={18} /><p className="text-sm">Failed to load complaints. Please refresh the page.</p>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>
      ) : (
        <div className="space-y-3">
          {complaints.length === 0 ? (
            <div className="card text-center py-10 text-gray-400">No complaints found</div>
          ) : complaints.map((c) => {
            const studentName = typeof c.student_id === "object" ? c.student_id.name : "—";
            return (
              <div key={c._id} className="card">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{studentName}</span>
                      {c.is_anonymous && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Anonymous</span>}
                      <StatusBadge status={c.status} />
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{c.message}</p>
                    <p className="text-xs text-gray-400 mt-2">{new Date(c.createdAt).toLocaleString()}</p>
                  </div>
                  {c.status === "OPEN" && (
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button onClick={() => handleAction(c._id, "resolve")} className="btn-success flex items-center gap-1.5 py-2 px-3 text-sm">
                        <CheckCircle size={15} /> Resolve
                      </button>
                      <button onClick={() => handleAction(c._id, "escalate")} className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-3 rounded-lg text-sm transition-colors">
                        <ArrowUpCircle size={15} /> Escalate
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Pagination page={page} pages={data?.pages || 1} onPageChange={setPage} />
    </div>
  );
}
