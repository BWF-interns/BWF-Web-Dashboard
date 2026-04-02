"use client";

import { useEffect, useState } from "react";
import { Bell, Search, MoreHorizontal, User } from "lucide-react";
import StatCard from "../components/StatCard";
import ActivityChart from "../components/ActivityChart";
import ActivityPanel from "../components/ActivityPanel";

export default function WardenDashboard() {
  const [warden, setWarden] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch("http://localhost:5000/api/warden/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setWarden(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-[#f3f6f4] p-8 text-black font-sans">
      {/* 🔹 HEADER */}
      <header className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome Back, {warden?.name?.split(" ")[0] || "Warden"} 👋
          </h1>
          <p className="text-gray-500 font-medium">
            Here's what's happening in your hostel today.
          </p>
        </div>

        <div className="flex items-center gap-5">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-white rounded-2xl py-2.5 pl-10 pr-4 shadow-sm border-none focus:ring-2 focus:ring-green-200 outline-none w-64 text-sm"
            />
          </div>
          <button className="bg-white p-2.5 rounded-2xl shadow-sm hover:bg-gray-50 transition">
            <Bell size={20} className="text-gray-600" />
          </button>
          
          {/* LinkedIn Style Icon */}
          <div className="w-12 h-12 rounded-full bg-orange-100 border-2 border-white shadow-sm flex items-center justify-center text-orange-600 font-bold text-lg overflow-hidden cursor-pointer hover:scale-105 transition">
            {warden?.profilePic ? (
              <img src={warden.profilePic} alt="profile" className="w-full h-full object-cover" />
            ) : (
              warden?.name?.charAt(0) || <User size={24} />
            )}
          </div>
        </div>
      </header>

      {/* 🔹 STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Students" value="120" date="March 2026" color="bg-[#fef3c7]" type="Students" />
        <StatCard title="Pending Complaints" value="08" date="March 2026" color="bg-[#dbeafe]" type="Complaints" />
        <StatCard title="Monthly Expenses" value="₹32,400" date="March 2026" color="bg-[#fce7f3]" type="Expenses" />
      </div>

      {/* 🔹 MAIN BENTO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
            <ActivityChart />
            
            {/* Detailed Info Card (From Image 1) */}
            <div className="bg-white p-8 rounded-4xl shadow-sm border border-gray-50">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Warden Information</h3>
                    <MoreHorizontal className="text-gray-400 cursor-pointer" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoRow label="Full Name" value={warden?.name || "Robert Smith"} />
                    <InfoRow label="Email" value={warden?.email || "robert@hostel.com"} />
                    <InfoRow label="Contact" value={warden?.phone || "+91 98765 43210"} />
                    <InfoRow label="Hostel Block" value={warden?.hostelName || "Block-A"} />
                </div>
            </div>
        </div>

        <div className="lg:col-span-4">
          <ActivityPanel />
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-green-200 transition">
            <div className="w-2 h-2 rounded-full bg-black" />
            <div>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">{label}</p>
                <p className="font-semibold text-sm">{value}</p>
            </div>
        </div>
    );
}