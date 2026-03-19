/**
 * Expenses page — view all student expenses with monthly total.
 * Filter by category. Add new expenses via inline form.
 */
"use client";
import { useEffect, useState, useCallback } from "react";

interface Expense {
  _id: string;
  student_id: { _id: string; name: string } | string;
  category: string; amount: number; description: string; date: string;
}

interface Student { _id: string; name: string; }

const CATEGORIES = ["Food", "Medical", "Education", "Misc"] as const;

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [filterCategory, setFilterCategory] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchExpenses = useCallback(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (filterCategory) params.set("category", filterCategory);
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/warden/expenses?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => { setExpenses(data.expenses || []); setPages(data.pages || 1); setMonthlyTotal(data.monthlyTotal || 0); })
      .catch(() => setError("Failed to load expenses."))
      .finally(() => setLoading(false));
  }, [page, filterCategory]);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/warden/students?limit=100`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => r.json()).then((d) => setStudents(d.students || []));
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-500 mt-1">Monthly total: <span className="font-semibold text-gray-900">₹{monthlyTotal.toLocaleString()}</span></p>
        </div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          + Add Expense
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["", ...CATEGORIES].map((c) => (
          <button key={c} onClick={() => { setFilterCategory(c); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${filterCategory === c ? "bg-blue-600 text-white border-blue-600" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
            {c || "All"}
          </button>
        ))}
      </div>

      {showForm && <AddExpenseForm students={students} onClose={() => setShowForm(false)} onSuccess={() => { setShowForm(false); fetchExpenses(); }} />}
      {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>
      ) : (
        <div className="border rounded-lg overflow-hidden shadow">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {["Student", "Category", "Amount", "Description", "Date"].map((h) => (
                  <th key={h} className="text-left px-6 py-3 font-medium text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {expenses.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-gray-400">No expenses found</td></tr>
              ) : expenses.map((e) => {
                const name = typeof e.student_id === "object" ? e.student_id.name : "—";
                return (
                  <tr key={e._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{name}</td>
                    <td className="px-6 py-4"><span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">{e.category}</span></td>
                    <td className="px-6 py-4 font-semibold">₹{e.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-500">{e.description || "—"}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(e.date).toLocaleDateString()}</td>
                  </tr>
                );
              })}
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

function AddExpenseForm({ students, onClose, onSuccess }: { students: Student[]; onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({ student_id: "", category: "Food", amount: "", description: "", date: new Date().toISOString().split("T")[0] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/warden/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, amount: parseFloat(form.amount) }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message); }
      onSuccess();
    } catch (err: unknown) { setError((err as Error).message || "Failed to add expense"); }
    finally { setLoading(false); }
  };

  return (
    <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
      <h3 className="font-semibold text-gray-900 mb-4">Add Expense</h3>
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Student *</label>
          <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.student_id} onChange={(e) => setForm({ ...form, student_id: e.target.value })} required>
            <option value="">Select student...</option>
            {students.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Category *</label>
          <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Amount (₹) *</label>
          <input type="number" step="0.01" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Date *</label>
          <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
          <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="col-span-2 flex gap-3 justify-end">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">{loading ? "Saving..." : "Add Expense"}</button>
        </div>
      </form>
    </div>
  );
}
