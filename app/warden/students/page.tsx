/**
 * Students list page — shows all students assigned to the logged-in warden.
 * Supports search and pagination. Add new students via inline form.
 */
"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface Student {
  _id: string; name: string; age: number; education: string; is_active: boolean;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchStudents = useCallback(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("search", search);
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/warden/students?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => { setStudents(data.students || []); setTotal(data.total || 0); setPages(data.pages || 1); })
      .catch(() => setError("Failed to load students."))
      .finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => {
    const t = setTimeout(fetchStudents, 400);
    return () => clearTimeout(t);
  }, [fetchStudents]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-500 mt-1">{total} students assigned to you</p>
        </div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          + Add Student
        </button>
      </div>

      <input
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
        placeholder="Search by name or education..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
      />

      {showForm && <AddStudentForm onClose={() => setShowForm(false)} onSuccess={() => { setShowForm(false); fetchStudents(); }} />}

      {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>
      ) : (
        <div className="border rounded-lg overflow-hidden shadow">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Age</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Education</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {students.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-gray-400">No students found</td></tr>
              ) : students.map((s) => (
                <tr key={s._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{s.name}</td>
                  <td className="px-6 py-4 text-gray-600">{s.age}</td>
                  <td className="px-6 py-4 text-gray-600">{s.education || "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${s.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {s.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/warden/students/${s._id}`} className="text-blue-600 hover:underline font-medium">View Profile</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pages > 1 && (
            <div className="flex items-center justify-center gap-3 px-6 py-4 border-t">
              <button onClick={() => setPage(page - 1)} disabled={page === 1} className="px-3 py-1 border rounded text-sm disabled:opacity-40">Previous</button>
              <span className="text-sm text-gray-600">Page {page} of {pages}</span>
              <button onClick={() => setPage(page + 1)} disabled={page === pages} className="px-3 py-1 border rounded text-sm disabled:opacity-40">Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AddStudentForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({ name: "", age: "", education: "", address: "", guardian_name: "", guardian_phone: "", guardian_relation: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/warden/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: form.name, age: parseInt(form.age), education: form.education, address: form.address, guardian_info: { name: form.guardian_name, phone: form.guardian_phone, relation: form.guardian_relation } }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message); }
      onSuccess();
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to add student");
    } finally { setLoading(false); }
  };

  return (
    <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
      <h3 className="font-semibold text-gray-900 mb-4">Add New Student</h3>
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        {[["Full Name *", "name", "text", true], ["Age *", "age", "number", true], ["Education", "education", "text", false], ["Address", "address", "text", false], ["Guardian Name", "guardian_name", "text", false], ["Guardian Phone", "guardian_phone", "text", false]].map(([label, field, type, req]) => (
          <div key={field as string}>
            <label className="block text-xs font-medium text-gray-700 mb-1">{label as string}</label>
            <input type={type as string} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form[field as keyof typeof form]} onChange={(e) => setForm({ ...form, [field as string]: e.target.value })} required={req as boolean} />
          </div>
        ))}
        <div className="col-span-2 flex gap-3 justify-end">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">{loading ? "Saving..." : "Add Student"}</button>
        </div>
      </form>
    </div>
  );
}
