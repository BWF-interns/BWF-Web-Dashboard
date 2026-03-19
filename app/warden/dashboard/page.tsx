"use client";

import {
  Users,
  Clock,
  DollarSign,
  AlertCircle,
  MessageSquare,
  UserX,
} from "lucide-react";

function Card({ label, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm">
      <div className={`p-2 sm:p-3 rounded-xl ${color}`}>
        <Icon className="text-white" size={18} />
      </div>
      <div>
        <p className="text-lg sm:text-xl font-semibold text-gray-900">
          {value}
        </p>
        <p className="text-xs sm:text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const summary = {
    totalStudents: 3,
    pendingActivities: 2,
    pendingPosts: 1,
    monthlyExpenses: 1700,
    openComplaints: 2,
    inactiveStudents: 1,
  };

  const feed = [
    {
      type: "complaint",
      message: "Arjun Kumar raised a complaint",
      status: "OPEN",
    },
    {
      type: "complaint",
      message: "Anonymous complaint raised",
      status: "OPEN",
    },
    {
      type: "expense",
      message: "Expense added for Meera Patel: ₹1200 (Education)",
    },
    {
      type: "expense",
      message: "Expense added for Arjun Kumar: ₹500 (Food)",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of your assigned students
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        <Card
          label="Total Students"
          value={summary.totalStudents}
          icon={Users}
          color="bg-blue-500"
        />
        <Card
          label="Pending Activities"
          value={summary.pendingActivities}
          icon={Clock}
          color="bg-yellow-500"
        />
        <Card
          label="Pending Posts"
          value={summary.pendingPosts}
          icon={MessageSquare}
          color="bg-purple-500"
        />
        <Card
          label="Monthly Expenses"
          value={`₹${summary.monthlyExpenses}`}
          icon={DollarSign}
          color="bg-green-500"
        />
        <Card
          label="Open Complaints"
          value={summary.openComplaints}
          icon={AlertCircle}
          color="bg-red-500"
        />
        <Card
          label="Inactive Students"
          value={summary.inactiveStudents}
          icon={UserX}
          color="bg-gray-500"
        />
      </div>

      {/* Alert */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-5">
        <p className="font-semibold text-yellow-800 mb-2 text-sm sm:text-base">
          Attention Required
        </p>
        <ul className="text-xs sm:text-sm text-yellow-700 space-y-1">
          <li>• 2 activities awaiting your approval</li>
          <li>• 1 posts awaiting moderation</li>
          <li>• 2 open complaints need attention</li>
          <li>• 1 students are marked inactive</li>
        </ul>
      </div>

      {/* Activity */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
          Recent Activity
        </h2>

        <ul className="space-y-3 sm:space-y-4">
          {feed.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <div
                className={`w-2 h-2 rounded-full mt-2 ${
                  item.type === "expense" ? "bg-green-500" : "bg-red-500"
                }`}
              />

              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 truncate">{item.message}</p>
                <p className="text-xs text-gray-400">3/18/2026, 6:32:56 PM</p>
              </div>

              {item.status && (
                <span className="text-[10px] sm:text-xs px-2 py-1 rounded-full bg-red-100 text-red-600 whitespace-nowrap">
                  {item.status}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
