"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";

export default function StudentsPage() {
  const [query, setQuery] = useState("");

  const students = [
    { name: "Arjun Kumar", age: 16, education: "Class 10", status: "Active" },
    { name: "Meera Patel", age: 14, education: "Class 8", status: "Active" },
    { name: "Ravi Singh", age: 17, education: "Class 11", status: "Inactive" },
  ];

  // 🔍 Filter logic
  const filteredStudents = students.filter((s) =>
    `${s.name} ${s.education}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6 text-black">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-black">
            Students
          </h1>
          <p className="text-sm text-black">
            {filteredStudents.length} students assigned to you
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
          <Plus size={16} />
          Add Student
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-black"
        />
        <input
          type="text"
          placeholder="Search by name or education..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm text-black">
          <thead className="bg-gray-50 text-black text-left">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Age</th>
              <th className="p-4">Education</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No students found
                </td>
              </tr>
            ) : (
              filteredStudents.map((s, i) => (
                <tr key={i} className="border-t">
                  <td className="p-4">{s.name}</td>
                  <td className="p-4">{s.age}</td>
                  <td className="p-4">{s.education}</td>
                  <td className="p-4">
                    <span
                      className={`${
                        s.status === "Active"
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="text-blue-600 hover:underline">
                      View Profile
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {filteredStudents.length === 0 ? (
          <p className="text-center text-gray-500 text-sm">
            No students found
          </p>
        ) : (
          filteredStudents.map((s, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-4 space-y-2 text-black"
            >
              <div className="flex justify-between items-center">
                <p className="font-medium">{s.name}</p>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    s.status === "Active"
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {s.status}
                </span>
              </div>

              <p className="text-sm">
                Age: {s.age} • {s.education}
              </p>

              <button className="text-blue-600 text-sm">
                View Profile
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}