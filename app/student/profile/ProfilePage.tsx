"use client";

import { useState } from "react";
import { Edit2, Save, User } from "lucide-react";
import Head from "next/head";

interface StudentProfile {
  name: string;
  age: number;
  dob: string;
  email: string;
  phone: string;
  address: string;
  guardianName: string;
  guardianContact: string;
  classInfo: string;
  interests: string[];
  role: string;
}

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState<StudentProfile>({
    name: "Aisha Sharma",
    age: 16,
    dob: "2010-05-14",
    email: "aisha.sharma@example.com",
    phone: "+91 9876543210",
    address: "123 Green Street, Delhi, India",
    guardianName: "Ms. Sharma",
    guardianContact: "+91 9123456780",
    classInfo: "10th Grade",
    interests: ["Drawing", "Science", "Music"],
    role: "Student",
  });

  const toggleEdit = () => setEditing(!editing);

  const handleChange = (field: keyof StudentProfile, value: any) => {
    setProfile({ ...profile, [field]: value });
  };

  return (
    <>
      {/* Head for SEO & page title */}
      <Head>
        <title>{profile.name} - Profile</title>
        <meta
          name="description"
          content="View and edit your personal information, contact details, and interests."
        />
      </Head>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <User size={28} className="text-gray-500" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                {profile.name}
              </h1>
              <p className="text-sm text-gray-500">{profile.role}</p>
            </div>
          </div>

          <button
            onClick={toggleEdit}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
          >
            {editing ? <Save size={16} /> : <Edit2 size={16} />}
            {editing ? "Save" : "Edit Profile"}
          </button>
        </div>

        {/* Personal Info Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-500 text-sm">Full Name</label>
              <input
                type="text"
                disabled={!editing}
                value={profile.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-gray-900 ${
                  editing ? "border-gray-300" : "border-transparent bg-gray-100"
                }`}
              />
            </div>

            <div>
              <label className="block text-gray-500 text-sm">Age</label>
              <input
                type="number"
                disabled
                value={profile.age}
                className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-gray-500 text-sm">
                Date of Birth
              </label>
              <input
                type="date"
                disabled
                value={profile.dob}
                className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-gray-500 text-sm">Email</label>
              <input
                type="email"
                disabled={!editing}
                value={profile.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-gray-900 ${
                  editing ? "border-gray-300" : "border-transparent bg-gray-100"
                }`}
              />
            </div>

            <div>
              <label className="block text-gray-500 text-sm">Phone</label>
              <input
                type="tel"
                disabled={!editing}
                value={profile.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-gray-900 ${
                  editing ? "border-gray-300" : "border-transparent bg-gray-100"
                }`}
              />
            </div>

            <div>
              <label className="block text-gray-500 text-sm">Class</label>
              <input
                type="text"
                disabled
                value={profile.classInfo}
                className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-gray-500 cursor-not-allowed"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-gray-500 text-sm">Address</label>
              <input
                type="text"
                disabled={!editing}
                value={profile.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-gray-900 ${
                  editing ? "border-gray-300" : "border-transparent bg-gray-100"
                }`}
              />
            </div>

            <div>
              <label className="block text-gray-500 text-sm">
                Guardian Name
              </label>
              <input
                type="text"
                disabled={!editing}
                value={profile.guardianName}
                onChange={(e) => handleChange("guardianName", e.target.value)}
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-gray-900 ${
                  editing ? "border-gray-300" : "border-transparent bg-gray-100"
                }`}
              />
            </div>

            <div>
              <label className="block text-gray-500 text-sm">
                Guardian Contact
              </label>
              <input
                type="tel"
                disabled={!editing}
                value={profile.guardianContact}
                onChange={(e) =>
                  handleChange("guardianContact", e.target.value)
                }
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-gray-900 ${
                  editing ? "border-gray-300" : "border-transparent bg-gray-100"
                }`}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-gray-500 text-sm">
                Interests / Hobbies
              </label>
              <input
                type="text"
                disabled={!editing}
                value={profile.interests.join(", ")}
                onChange={(e) =>
                  handleChange(
                    "interests",
                    e.target.value.split(",").map((i) => i.trim()),
                  )
                }
                className={`mt-1 w-full rounded-lg border px-3 py-2 text-gray-900 ${
                  editing ? "border-gray-300" : "border-transparent bg-gray-100"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Optional Security / Account Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Account & Security
          </h2>
          <div className="space-y-2">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition text-sm">
              Change Password
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition text-sm">
              Update Profile Picture
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
