"use client";
import { useState, useEffect } from "react";
import useSWR from "swr";
import Link from "next/link";
import api from "@/lib/api";
import { Student } from "@/lib/types";
import { Pagination } from "@/components/UI";
import { Search, Plus, UserCheck, UserX, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const fetcher = (url: string) => api.get(url).then((r) => r.data);

function useDebounce(value: string, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const debouncedSearch = useDebounce(search);

  const params = new URLSearchParams({ page: String(page), limit: "20" });
  if (debouncedSearch) params.set("search", debouncedSearch);

  const { data, isLoading, error, mutate } = useSWR(`/warden/students?${params}`, fetcher);
  const students: Student[] = data?.students || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-500 mt-1">{data?.total ?? 0} students assigned to you</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Student
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          className="input pl-9"
          placeholder="Search by name or education..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {showForm && <AddStudentForm onClose={() => setShowForm(false)} onSuccess={() => { setShowForm(false); mutate(); }} />}

      {error ? (
        <div className="card flex items-center gap-3 text-red-600 bg-red-50 border-red-200">
          <AlertCircle size={18} />
          <p className="text-sm">Failed to load students. Please refresh the page.</p>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Age</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Education</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {students.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-gray-400">No students found</td></tr>
              ) : students.map((s) => (
                <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{s.name}</td>
                  <td className="px-6 py-4 text-gray-600">{s.age}</td>
                  <td className="px-6 py-4 text-gray-600">{s.education || "—"}</td>
                  <td className="px-6 py-4">
                    {s.is_active
                      ? <span className="flex items-center gap-1 text-green-600 text-xs"><UserCheck size={14} /> Active</span>
                      : <span className="flex items-center gap-1 text-gray-400 text-xs"><UserX size={14} /> Inactive</span>}
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/students/${s._id}`} className="text-blue-600 hover:underline font-medium">
                      View Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-6 py-4 border-t border-gray-100">
            <Pagination page={page} pages={data?.pages || 1} onPageChange={setPage} />
          </div>
        </div>
      )}
    </div>
  );
}

function AddStudentForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({
    name: "", age: "", education: "", address: "",
    guardian_name: "", guardian_phone: "", guardian_relation: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/warden/students", {
        name: form.name,
        age: parseInt(form.age),
        education: form.education,
        address: form.address,
        guardian_info: { name: form.guardian_name, phone: form.guardian_phone, relation: form.guardian_relation },
      });
      toast.success("Student added");
      onSuccess();
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to add student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card border-blue-200 bg-blue-50">
      <h3 className="font-semibold text-gray-900 mb-4">Add New Student</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
          <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Age *</label>
          <input type="number" className="input" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} required />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Education</label>
          <input className="input" value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
          <input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Guardian Name</label>
          <input className="input" value={form.guardian_name} onChange={(e) => setForm({ ...form, guardian_name: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Guardian Phone</label>
          <input className="input" value={form.guardian_phone} onChange={(e) => setForm({ ...form, guardian_phone: e.target.value })} />
        </div>
        <div className="col-span-2 flex gap-3 justify-end">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary">{loading ? "Saving..." : "Add Student"}</button>
        </div>
      </form>
    </div>
  );
}
