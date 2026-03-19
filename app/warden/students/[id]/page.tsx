/**
 * Student profile page — tabbed view.
 * Tabs: Personal Info (editable), Activities, Expenses, Complaints.
 */
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Student {
  _id: string; name: string; age: number; education: string; address: string;
  is_active: boolean; guardian_info: { name: string; phone: string; relation: string };
}

const TABS = ["Personal Info", "Activities", "Expenses", "Complaints"] as const;
type Tab = typeof TABS[number];

export default function StudentProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [tab, setTab] = useState<Tab>("Personal Info");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStudent = () => {
    const token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/warden/students/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setStudent(d.student))
      .catch(() => setError("Failed to load student."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStudent(); }, [id]);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;
  if (error || !student) return <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error || "Student not found"}</div>;

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/warden/students" className="text-gray-400 hover:text-gray-600 text-sm">← Back</Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
          <p className="text-gray-500 text-sm">Age {student.age} · {student.education || "No education info"}</p>
        </div>
        <span className={`ml-auto px-3 py-1 rounded-full text-xs font-medium ${student.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
          {student.is_active ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="flex gap-1 border-b">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === t ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "Personal Info" && <PersonalInfoTab student={student} onSave={fetchStudent} />}
      {tab === "Activities" && <TabData url={`/warden/activities?student_id=${id}`} render={(d) => <ActivityList items={d.activities || []} />} />}
      {tab === "Expenses" && <TabData url={`/warden/expenses?student_id=${id}`} render={(d) => <ExpenseList items={d.expenses || []} />} />}
      {tab === "Complaints" && <TabData url={`/warden/complaints?student_id=${id}`} render={(d) => <ComplaintList items={d.complaints || []} />} />}
    </div>
  );
}

function TabData({ url, render }: { url: string; render: (d: Record<string, unknown>) => React.ReactNode }) {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json()).then(setData).finally(() => setLoading(false));
  }, [url]);
  if (loading) return <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" /></div>;
  return <>{data ? render(data) : null}</>;
}

function PersonalInfoTab({ student, onSave }: { student: Student; onSave: () => void }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: student.name, age: String(student.age), education: student.education || "", address: student.address || "", is_active: student.is_active, guardian_name: student.guardian_info?.name || "", guardian_phone: student.guardian_info?.phone || "", guardian_relation: student.guardian_info?.relation || "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({ name: student.name, age: String(student.age), education: student.education || "", address: student.address || "", is_active: student.is_active, guardian_name: student.guardian_info?.name || "", guardian_phone: student.guardian_info?.phone || "", guardian_relation: student.guardian_info?.relation || "" });
  }, [student]);

  const handleSave = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/warden/students/${student._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: form.name, age: parseInt(form.age), education: form.education, address: form.address, is_active: form.is_active, guardian_info: { name: form.guardian_name, phone: form.guardian_phone, relation: form.guardian_relation } }),
    });
    setEditing(false);
    setLoading(false);
    onSave();
  };

  const fields: [string, keyof typeof form, string][] = [["Full Name", "name", "text"], ["Age", "age", "number"], ["Education", "education", "text"], ["Address", "address", "text"]];

  return (
    <div className="border rounded-lg p-6 space-y-6">
      <div className="flex justify-end gap-2">
        {editing ? (
          <>
            <button onClick={() => setEditing(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
            <button onClick={handleSave} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">{loading ? "Saving..." : "Save"}</button>
          </>
        ) : (
          <button onClick={() => setEditing(true)} className="px-4 py-2 border rounded-lg text-sm">Edit</button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-6">
        {fields.map(([label, field, type]) => (
          <div key={field}>
            <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
            {editing
              ? <input type={type} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form[field] as string} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
              : <p className="text-sm text-gray-900">{(form[field] as string) || "—"}</p>}
          </div>
        ))}
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Guardian</p>
        <div className="grid grid-cols-3 gap-4">
          {(["guardian_name", "guardian_phone", "guardian_relation"] as const).map((f) => (
            <div key={f}>
              <label className="block text-xs font-medium text-gray-500 mb-1">{f.replace("guardian_", "").replace("_", " ")}</label>
              {editing
                ? <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} />
                : <p className="text-sm text-gray-900">{form[f] || "—"}</p>}
            </div>
          ))}
        </div>
      </div>
      {editing && (
        <div className="flex items-center gap-2">
          <input type="checkbox" id="is_active" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
          <label htmlFor="is_active" className="text-sm text-gray-700">Active Student</label>
        </div>
      )}
    </div>
  );
}

function ActivityList({ items }: { items: { _id: string; type: string; hours: number; status: string; createdAt: string }[] }) {
  const STATUS_COLORS: Record<string, string> = { PENDING: "bg-yellow-100 text-yellow-700", APPROVED: "bg-green-100 text-green-700", REJECTED: "bg-red-100 text-red-700" };
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b"><tr>{["Type", "Hours", "Status", "Date"].map((h) => <th key={h} className="text-left px-6 py-3 font-medium text-gray-600">{h}</th>)}</tr></thead>
        <tbody className="divide-y">
          {items.length === 0 ? <tr><td colSpan={4} className="text-center py-8 text-gray-400">No activities</td></tr>
            : items.map((a) => <tr key={a._id}><td className="px-6 py-3">{a.type}</td><td className="px-6 py-3">{a.hours}h</td><td className="px-6 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[a.status]}`}>{a.status}</span></td><td className="px-6 py-3 text-gray-500">{new Date(a.createdAt).toLocaleDateString()}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}

function ExpenseList({ items }: { items: { _id: string; category: string; amount: number; description: string; date: string }[] }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b"><tr>{["Category", "Amount", "Description", "Date"].map((h) => <th key={h} className="text-left px-6 py-3 font-medium text-gray-600">{h}</th>)}</tr></thead>
        <tbody className="divide-y">
          {items.length === 0 ? <tr><td colSpan={4} className="text-center py-8 text-gray-400">No expenses</td></tr>
            : items.map((e) => <tr key={e._id}><td className="px-6 py-3">{e.category}</td><td className="px-6 py-3 font-medium">₹{e.amount.toLocaleString()}</td><td className="px-6 py-3 text-gray-500">{e.description || "—"}</td><td className="px-6 py-3 text-gray-500">{new Date(e.date).toLocaleDateString()}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}

function ComplaintList({ items }: { items: { _id: string; message: string; status: string; is_anonymous: boolean; createdAt: string }[] }) {
  const STATUS_COLORS: Record<string, string> = { OPEN: "bg-yellow-100 text-yellow-700", RESOLVED: "bg-green-100 text-green-700", ESCALATED: "bg-purple-100 text-purple-700" };
  return (
    <div className="space-y-3">
      {items.length === 0 ? <div className="border rounded-lg p-8 text-center text-gray-400">No complaints</div>
        : items.map((c) => (
          <div key={c._id} className="border rounded-lg p-4">
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm text-gray-800 flex-1">{c.message}</p>
              <div className="flex items-center gap-2">
                {c.is_anonymous && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Anonymous</span>}
                <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[c.status]}`}>{c.status}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">{new Date(c.createdAt).toLocaleString()}</p>
          </div>
        ))}
    </div>
  );
}
