/**
 * Expenses page — view all student expenses with monthly total.
 * Filter by category. Add new expenses via inline form.
 */
"use client";
import { useState } from "react";
import useSWR from "swr";
import api from "@/services/api";
import { Expense, Student } from "@/modules/warden/types";
import { Pagination } from "@/modules/warden/components/UI";
import toast from "react-hot-toast";
import { Plus, AlertCircle } from "lucide-react";

const fetcher = (url: string) => api.get(url).then((r) => r.data);
const CATEGORIES = ["Food", "Medical", "Education", "Misc"] as const;

export default function ExpensesPage() {
  const [page, setPage] = useState(1);
  const [filterCategory, setFilterCategory] = useState("");
  const [showForm, setShowForm] = useState(false);

  const params = new URLSearchParams({ page: String(page), limit: "20" });
  if (filterCategory) params.set("category", filterCategory);

  const { data, isLoading, error, mutate } = useSWR(`/warden/expenses?${params}`, fetcher);
  const { data: studentsData } = useSWR("/warden/students?limit=100", fetcher);
  const expenses: Expense[] = data?.expenses || [];
  const students: Student[] = studentsData?.students || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-500 mt-1">
            Monthly total: <span className="font-semibold text-gray-900">₹{data?.monthlyTotal?.toLocaleString() ?? 0}</span>
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Expense
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["", ...CATEGORIES].map((c) => (
          <button key={c} onClick={() => { setFilterCategory(c); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterCategory === c ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
            {c || "All"}
          </button>
        ))}
      </div>

      {showForm && <AddExpenseForm students={students} onClose={() => setShowForm(false)} onSuccess={() => { setShowForm(false); mutate(); }} />}

      {error ? (
        <div className="card flex items-center gap-3 text-red-600 bg-red-50 border-red-200">
          <AlertCircle size={18} /><p className="text-sm">Failed to load expenses. Please refresh the page.</p>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Student</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Category</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Amount</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Description</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {expenses.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-gray-400">No expenses found</td></tr>
              ) : expenses.map((e) => {
                const studentName = typeof e.student_id === "object" ? e.student_id.name : "—";
                return (
                  <tr key={e._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{studentName}</td>
                    <td className="px-6 py-4">{e.category}</td>
                    <td className="px-6 py-4 font-semibold">₹{e.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-500">{e.description || "—"}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(e.date).toLocaleDateString()}</td>
                  </tr>
                );
              })}
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

function AddExpenseForm({ students, onClose, onSuccess }: {
  students: Student[]; onClose: () => void; onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    student_id: "", category: "Food" as typeof CATEGORIES[number],
    amount: "", description: "", date: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/warden/expenses", { ...form, amount: parseFloat(form.amount) });
      toast.success("Expense added");
      onSuccess();
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to add expense");
    } finally { setLoading(false); }
  };

  return (
    <div className="card border-blue-200 bg-blue-50">
      <h3 className="font-semibold text-gray-900 mb-4">Add Expense</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Student *</label>
          <select className="input" value={form.student_id} onChange={(e) => setForm({ ...form, student_id: e.target.value })} required>
            <option value="">Select student...</option>
            {students.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Category *</label>
          <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as typeof CATEGORIES[number] })}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Amount (₹) *</label>
          <input type="number" step="0.01" className="input" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Date *</label>
          <input type="date" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
          <input className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="col-span-2 flex gap-3 justify-end">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary">{loading ? "Saving..." : "Add Expense"}</button>
        </div>
      </form>
    </div>
  );
}
