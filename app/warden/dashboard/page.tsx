/**
 * Warden Dashboard page.
 * Shows summary cards (students, pending items, expenses, complaints)
 * and a recent activity feed from the backend API.
 */
"use client";
import { useEffect, useState } from "react";

interface DashboardSummary {
  totalStudents: number;
  pendingActivities: number;
  pendingPosts: number;
  monthlyExpenses: number;
  openComplaints: number;
  inactiveStudents: number;
}

interface FeedItem {
  type: string;
  message: string;
  status?: string;
  time: string;
}

export default function WardenDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/warden/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => { setSummary(data.summary); setFeed(data.feed || []); })
      .catch(() => setError("Failed to load dashboard."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;
  if (error) return <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>;

  const cards = [
    { label: "Total Students", value: summary?.totalStudents ?? 0, color: "bg-blue-500" },
    { label: "Pending Activities", value: summary?.pendingActivities ?? 0, color: "bg-yellow-500" },
    { label: "Pending Posts", value: summary?.pendingPosts ?? 0, color: "bg-purple-500" },
    { label: "Monthly Expenses", value: `₹${summary?.monthlyExpenses?.toLocaleString() ?? 0}`, color: "bg-green-500" },
    { label: "Open Complaints", value: summary?.openComplaints ?? 0, color: "bg-red-500" },
    { label: "Inactive Students", value: summary?.inactiveStudents ?? 0, color: "bg-gray-500" },
  ];

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Warden Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your assigned students</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="p-4 border rounded-lg shadow flex items-center gap-4">
            <div className={`w-3 h-10 rounded ${c.color}`} />
            <div>
              <p className="text-2xl font-bold text-gray-900">{c.value}</p>
              <p className="text-sm text-gray-500">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      {((summary?.pendingActivities ?? 0) > 0 || (summary?.openComplaints ?? 0) > 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="font-semibold text-yellow-800 mb-1">Attention Required</p>
          <ul className="text-sm text-yellow-700 space-y-1">
            {(summary?.pendingActivities ?? 0) > 0 && <li>• {summary!.pendingActivities} activities awaiting approval</li>}
            {(summary?.pendingPosts ?? 0) > 0 && <li>• {summary!.pendingPosts} posts awaiting moderation</li>}
            {(summary?.openComplaints ?? 0) > 0 && <li>• {summary!.openComplaints} open complaints need attention</li>}
          </ul>
        </div>
      )}

      <div className="border rounded-lg p-4 shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        {feed.length === 0 ? (
          <p className="text-gray-400 text-sm">No recent activity</p>
        ) : (
          <ul className="space-y-3">
            {feed.map((item, i) => (
              <li key={i} className="flex items-start gap-3 py-2 border-b last:border-0">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${item.type === "activity" ? "bg-blue-400" : item.type === "expense" ? "bg-green-400" : "bg-red-400"}`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{item.message}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(item.time).toLocaleString()}</p>
                </div>
                {item.status && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${item.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : item.status === "APPROVED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {item.status}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
