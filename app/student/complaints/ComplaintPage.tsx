"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../styles/dashboard.css";
import { Bell } from "lucide-react";
import { useNotices } from "../context/NoticeContext";
import { useProfile } from "../context/ProfileContext";
import { getAvatar } from "../constants/avatars";

export default function ComplaintsPage() {
  const router = useRouter();
  const { unreadCount } = useNotices();
  const { avatarId, name } = useProfile();
  const av = getAvatar(avatarId);

  const [greeting, setGreeting] = useState("Welcome");
  const firstName = name.split(" ")[0];

  // form state
  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [category, setCategory] = useState("other");
  const [priority, setPriority] = useState("medium");

  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting("Good morning");
    else if (h < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    const token = localStorage.getItem("accessToken");

    const res = await fetch("http://localhost:5000/student/complaints", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (res.ok) setComplaints(data);
  };

  const submitComplaint = async () => {
    const token = localStorage.getItem("accessToken");

    const res = await fetch("http://localhost:5000/student/complaints", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message,
        anonymous,
        category,
        priority,
      }),
    });

    if (res.ok) {
      setMessage("");
      fetchComplaints();
    }
  };

  return (
    <main className="main-content">
      {/* HEADER */}
      <header className="top-header">
        <h1>
          {greeting}, {firstName} 👋
        </h1>

        <div className="header-actions">
          <button
            className="dash-bell-btn"
            onClick={() => router.push("/student/noticeboard")}
          >
            <Bell size={19} />
            {unreadCount > 0 && (
              <span className="dash-bell-badge">{unreadCount}</span>
            )}
          </button>

          <button
            className="dash-avatar-btn"
            style={{ background: av.bg }}
            onClick={() => router.push("/student/profile")}
          >
            <span>{av.emoji}</span>
          </button>
        </div>
      </header>

      {/* SUPPORT BANNER */}
      <section className="welcome-banner">
        <div className="welcome-text">
          <h2>Need help or want to share something?</h2>
          <p>Your voice matters. We’re here to support you 💙</p>
        </div>
        <div className="mood-tracker">
          <span className="emoji">🛟</span>
        </div>
      </section>

      {/* GRID */}
      <section className="dashboard-grid">
        {/* FORM */}
        <div className="card p-5 sm:p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Raise a Complaint
          </h3>

          {/* TEXTAREA */}
          <div>
            <textarea
              className="w-full rounded-xl border border-gray-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              rows={4}
              placeholder="Tell us what's bothering you..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {/* SELECTS */}
          <div className="flex gap-4 flex-wrap">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex-1 min-w-[160px] rounded-xl border border-gray-200 p-3 text-sm bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="safety">🛡️ Safety</option>
              <option value="infrastructure">🏠 Infrastructure</option>
              <option value="food">🍽️ Food</option>
              <option value="other">📌 Other</option>
            </select>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="flex-1 min-w-[160px] rounded-xl border border-gray-200 p-3 text-sm bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
          </div>

          {/* CHECKBOX */}
          <div className="pt-1">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={() => setAnonymous(!anonymous)}
                className="accent-blue-600"
              />
              Submit anonymously
            </label>
          </div>

          {/* BUTTON */}
          <div className="pt-2">
            <button
              onClick={submitComplaint}
              className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-xl text-sm font-medium"
            >
              Submit Complaint
            </button>
          </div>
        </div>

        {/* MY COMPLAINTS */}
        <div className="card space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Your Complaints
          </h3>

          {complaints.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-sm">
              😌 No complaints yet
              <p className="mt-1 text-xs text-gray-400">
                You're all good for now!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {complaints.map((c: any) => (
                <div
                  key={c._id}
                  className="border border-gray-200 rounded-xl p-4 bg-white hover:shadow-sm transition"
                >
                  {/* TOP ROW */}
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-gray-800 line-clamp-2">
                      {c.message}
                    </p>

                    <span
                      className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                        c.status === "OPEN"
                          ? "bg-blue-100 text-blue-600"
                          : c.status === "RESOLVED"
                            ? "bg-green-100 text-green-600"
                            : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  {/* META */}
                  <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                    <span>
                      {c.category} • {c.priority}
                    </span>

                    <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
