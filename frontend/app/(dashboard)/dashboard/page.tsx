"use client";
import useSWR from "swr";
import api from "@/lib/api";
import { DashboardSummary, FeedItem } from "@/lib/types";
import { Users, Clock, DollarSign, AlertCircle, MessageSquare, UserX } from "lucide-react";

const fetcher = (url: string) => api.get(url).then((r) => r.data);

function SummaryCard({
  label, value, icon: Icon, color,
}: { label: string; value: number | string; icon: React.ElementType; color: string }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading, error } = useSWR("/warden/dashboard", fetcher);
  const summary: DashboardSummary = data?.summary;
  const feed: FeedItem[] = data?.feed || [];

  if (error) {
    return (
      <div className="card flex items-center gap-3 text-red-600 bg-red-50 border-red-200 max-w-lg">
        <AlertCircle size={18} />
        <p className="text-sm">Failed to load dashboard. Please refresh the page.</p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your assigned students</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <SummaryCard label="Total Students" value={summary?.totalStudents ?? 0} icon={Users} color="bg-blue-500" />
        <SummaryCard label="Pending Activities" value={summary?.pendingActivities ?? 0} icon={Clock} color="bg-yellow-500" />
        <SummaryCard label="Pending Posts" value={summary?.pendingPosts ?? 0} icon={MessageSquare} color="bg-purple-500" />
        <SummaryCard label="Monthly Expenses" value={`₹${summary?.monthlyExpenses?.toLocaleString() ?? 0}`} icon={DollarSign} color="bg-green-500" />
        <SummaryCard label="Open Complaints" value={summary?.openComplaints ?? 0} icon={AlertCircle} color="bg-red-500" />
        <SummaryCard label="Inactive Students" value={summary?.inactiveStudents ?? 0} icon={UserX} color="bg-gray-500" />
      </div>

      {(summary?.pendingActivities > 0 || summary?.openComplaints > 0 || summary?.pendingPosts > 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="font-semibold text-yellow-800 mb-1">Attention Required</p>
          <ul className="text-sm text-yellow-700 space-y-1">
            {summary?.pendingActivities > 0 && <li>• {summary.pendingActivities} activities awaiting your approval</li>}
            {summary?.pendingPosts > 0 && <li>• {summary.pendingPosts} posts awaiting moderation</li>}
            {summary?.openComplaints > 0 && <li>• {summary.openComplaints} open complaints need attention</li>}
            {summary?.inactiveStudents > 0 && <li>• {summary.inactiveStudents} students are marked inactive</li>}
          </ul>
        </div>
      )}

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        {feed.length === 0 ? (
          <p className="text-gray-400 text-sm">No recent activity</p>
        ) : (
          <ul className="space-y-3">
            {feed.map((item, i) => (
              <li key={i} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  item.type === "activity" ? "bg-blue-400" :
                  item.type === "expense" ? "bg-green-400" : "bg-red-400"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800">{item.message}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(item.time).toLocaleString()}</p>
                </div>
                {item.status && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    item.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                    item.status === "APPROVED" ? "bg-green-100 text-green-700" :
                    "bg-red-100 text-red-700"
                  }`}>{item.status}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
