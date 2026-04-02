"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { useNotices } from "../context/NoticeContext";
import { useProfile } from "../context/ProfileContext";
import { getAvatar } from "../constants/avatars";

export default function ComplaintsPage() {
  const router = useRouter();
  const { unreadCount } = useNotices();
  const { avatarId, name } = useProfile();
  const av = getAvatar(avatarId);

  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [category, setCategory] = useState("other");
  const [priority, setPriority] = useState("medium");
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    const token = localStorage.getItem("accessToken");

    const res = await fetch("http://localhost:5000/student/complaints", {
      headers: { Authorization: `Bearer ${token}` },
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
      body: JSON.stringify({ message, anonymous, category, priority }),
    });

    if (res.ok) {
      setMessage("");
      fetchComplaints();
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-6 py-8">
      {/* CONTAINER */}
      <div className="max-w-6xl mx-auto space-y-8">
        {/* HEADER */}
        <header className="flex justify-between items-end flex-wrap gap-4">
          <div>
            <p className="text-[11px] font-extrabold tracking-widest text-blue-600 uppercase">
              Support
            </p>

            <h1 className="text-3xl font-black text-gray-800">Complaints</h1>

            <p className="text-sm text-gray-500 mt-1">
              Raise and track your issues
            </p>
          </div>

          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <div className="flex items-center gap-1 bg-pink-100 text-pink-600 border border-pink-200 text-xs font-bold px-3 py-1 rounded-full">
                <Bell size={14} />
                {unreadCount}
              </div>
            )}

            <button
              onClick={() => router.push("/student/noticeboard")}
              className="w-10 h-10 rounded-xl border bg-white flex items-center justify-center hover:bg-blue-50 transition"
            >
              <Bell size={18} />
            </button>

            <button
              onClick={() => router.push("/student/profile")}
              style={{ background: av.bg }}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow"
            >
              {av.emoji}
            </button>
          </div>
        </header>

        {/* BANNER */}
        <section className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Need help or want to share something?
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Your voice matters. We're here to support you 💙
            </p>
          </div>
          <span className="text-4xl">🛟</span>
        </section>

        {/* GRID */}
        <section className="grid md:grid-cols-2 gap-8">
          {/* FORM */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
            <h3 className="text-lg font-semibold text-gray-800">
              Raise a Complaint
            </h3>

            <textarea
              className="w-full rounded-xl border border-gray-200 p-4 text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
              rows={4}
              placeholder="Tell us what's bothering you..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <div className="flex gap-3 flex-wrap">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex-1 min-w-[140px] rounded-xl border border-gray-200 p-3 text-sm bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="safety">🛡️ Safety</option>
                <option value="infrastructure">🏠 Infrastructure</option>
                <option value="food">🍽️ Food</option>
                <option value="other">📌 Other</option>
              </select>

              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="flex-1 min-w-[140px] rounded-xl border border-gray-200 p-3 text-sm bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={() => setAnonymous(!anonymous)}
                className="accent-blue-600"
              />
              Submit anonymously
            </label>

            <button
              onClick={submitComplaint}
              className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-xl text-sm font-medium shadow-sm hover:scale-[1.02]"
            >
              Submit Complaint
            </button>
          </div>

          {/* LIST */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Your Complaints
            </h3>

            {complaints.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center text-gray-500 text-sm shadow-sm">
                <span className="text-3xl block mb-2">😌</span>
                No complaints yet
                <p className="text-xs text-gray-400 mt-1">
                  You're all good for now!
                </p>
              </div>
            ) : (
              complaints.map((c: any) => (
                <div
                  key={c._id}
                  className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex justify-between gap-3">
                    <p className="text-sm font-medium text-gray-800 line-clamp-2">
                      {c.message}
                    </p>

                    <span
                      className={`text-xs px-2 py-1 rounded-full whitespace-nowrap font-medium
                      ${
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

                  <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                    <div className="flex gap-2 flex-wrap">
                      <span className="bg-gray-100 px-2 py-1 rounded-full">
                        {c.category}
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded-full">
                        {c.priority}
                      </span>
                    </div>

                    <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
