/**
 * Student profile page — tabbed view with:
 * Personal Info (editable), Activities, Expenses, Complaints.
 * Form resets when navigating between different student profiles.
 */
"use client";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { useParams } from "next/navigation";
import api from "@/services/api";
import { Student, Activity, Expense, Complaint } from "@/modules/warden/types";
import { StatusBadge } from "@/modules/warden/components/UI";
import toast from "react-hot-toast";
import { ArrowLeft, Edit2, Save, X, AlertCircle } from "lucide-react";
import Link from "next/link";

const fetcher = (url: string) => api.get(url).then((r) => r.data);
const TABS = ["Personal Info", "Activities", "Expenses", "Complaints"] as const;
type Tab = typeof TABS[number];

export default function StudentProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState<Tab>("Personal Info");
  const [editing, setEditing] = useState(false);

  const { data: studentData, error: studentError, mutate } = useSWR(`/warden/students/${id}`, fetcher);
  const student: Student = studentData?.student;

  const { data: activitiesData, error: activitiesError } = useSWR(tab === "Activities" ? `/warden/activities?student_id=${id}` : null, fetcher);
  const { data: expensesData, error: expensesError } = useSWR(tab === "Expenses" ? `/warden/expenses?student_id=${id}` : null, fetcher);
  const { data: complaintsData, error: complaintsError } = useSWR(tab === "Complaints" ? `/warden/complaints?student_id=${id}` : null, fetcher);

  if (studentError) {
    return (
      <div className="card flex items-center gap-3 text-red-600 bg-red-50 border-red-200 max-w-lg">
        <AlertCircle size={18} />
        <p className="text-sm">Failed to load student profile. Please go back and try again.</p>
      </div>
    );
  }

  if (!student) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/warden/students" className="text-gray-400 hover:text-gray-600"><ArrowLeft size={20} /></Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
          <p className="text-gray-500 text-sm">Age {student.age} · {student.education || "No education info"}</p>
        </div>
        <span className={`ml-auto px-3 py-1 rounded-full text-xs font-medium ${student.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
          {student.is_active ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map((t) => (
          <button key={t} onClick={() => { setTab(t); setEditing(false); }}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === t ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "Personal Info" && <PersonalInfoTab student={student} editing={editing} setEditing={setEditing} onSave={mutate} />}
      {tab === "Activities" && (activitiesError ? <ErrorMsg /> : <ActivitiesTab activities={activitiesData?.activities || []} loading={!activitiesData} />)}
      {tab === "Expenses" && (expensesError ? <ErrorMsg /> : <ExpensesTab expenses={expensesData?.expenses || []} loading={!expensesData} />)}
      {tab === "Complaints" && (complaintsError ? <ErrorMsg /> : <ComplaintsTab complaints={complaintsData?.complaints || []} loading={!complaintsData} />)}
    </div>
  );
}

function ErrorMsg() {
  return (
    <div className="card flex items-center gap-3 text-red-600 bg-red-50 border-red-200">
      <AlertCircle size={18} /><p className="text-sm">Failed to load data. Please try again.</p>
    </div>
  );
}

function PersonalInfoTab({ student, editing, setEditing, onSave }: {
  student: Student; editing: boolean; setEditing: (v: boolean) => void; onSave: () => void;
}) {
  const [form, setForm] = useState({
    name: student.name, age: String(student.age), education: student.education || "",
    address: student.address || "", is_active: student.is_active,
    guardian_name: student.guardian_info?.name || "",
    guardian_phone: student.guardian_info?.phone || "",
    guardian_relation: student.guardian_info?.relation || "",
  });
  const [loading, setLoading] = useState(false);

  // Reset form when student prop changes (navigating between profiles)
  useEffect(() => {
    setForm({
      name: student.name, age: String(student.age), education: student.education || "",
      address: student.address || "", is_active: student.is_active,
      guardian_name: student.guardian_info?.name || "",
      guardian_phone: student.guardian_info?.phone || "",
      guardian_relation: student.guardian_info?.relation || "",
    });
  }, [student]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put(`/warden/students/${student._id}`, {
        name: form.name, age: parseInt(form.age), education: form.education,
        address: form.address, is_active: form.is_active,
        guardian_info: { name: form.guardian_name, phone: form.guardian_phone, relation: form.guardian_relation },
      });
      toast.success("Profile updated");
      setEditing(false);
      onSave();
    } catch { toast.error("Failed to update"); }
    finally { setLoading(false); }
  };

  const Field = ({ label, value, field }: { label: string; value: string; field: keyof typeof form }) => (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      {editing
        ? <input className="input" value={form[field] as string} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
        : <p className="text-sm text-gray-900">{value || "—"}</p>}
    </div>
  );

  return (
    <div className="card space-y-6">
      <div className="flex justify-end gap-2">
        {editing ? (
          <>
            <button onClick={() => setEditing(false)} className="btn-secondary flex items-center gap-1"><X size={14} /> Cancel</button>
            <button onClick={handleSave} disabled={loading} className="btn-primary flex items-center gap-1"><Save size={14} /> {loading ? "Saving..." : "Save"}</button>
          </>
        ) : (
          <button onClick={() => setEditing(true)} className="btn-secondary flex items-center gap-1"><Edit2 size={14} /> Edit</button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-6">
        <Field label="Full Name" value={student.name} field="name" />
        <Field label="Age" value={String(student.age)} field="age" />
        <Field label="Education" value={student.education} field="education" />
        <Field label="Address" value={student.address} field="address" />
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Guardian Information</p>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Name" value={student.guardian_info?.name} field="guardian_name" />
          <Field label="Phone" value={student.guardian_info?.phone} field="guardian_phone" />
          <Field label="Relation" value={student.guardian_info?.relation} field="guardian_relation" />
        </div>
      </div>
      {editing && (
        <div className="flex items-center gap-2">
          <input type="checkbox" id="is_active" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded" />
          <label htmlFor="is_active" className="text-sm text-gray-700">Active Student</label>
        </div>
      )}
    </div>
  );
}

function ActivitiesTab({ activities, loading }: { activities: Activity[]; loading: boolean }) {
  if (loading) return <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" /></div>;
  return (
    <div className="card p-0 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b"><tr>
          <th className="text-left px-6 py-3 font-medium text-gray-600">Type</th>
          <th className="text-left px-6 py-3 font-medium text-gray-600">Hours</th>
          <th className="text-left px-6 py-3 font-medium text-gray-600">Status</th>
          <th className="text-left px-6 py-3 font-medium text-gray-600">Date</th>
        </tr></thead>
        <tbody className="divide-y divide-gray-50">
          {activities.length === 0 ? <tr><td colSpan={4} className="text-center py-8 text-gray-400">No activities</td></tr>
            : activities.map((a) => (
              <tr key={a._id}>
                <td className="px-6 py-3">{a.type}</td>
                <td className="px-6 py-3">{a.hours}h</td>
                <td className="px-6 py-3"><StatusBadge status={a.status} /></td>
                <td className="px-6 py-3 text-gray-500">{new Date(a.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

function ExpensesTab({ expenses, loading }: { expenses: Expense[]; loading: boolean }) {
  if (loading) return <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" /></div>;
  return (
    <div className="card p-0 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b"><tr>
          <th className="text-left px-6 py-3 font-medium text-gray-600">Category</th>
          <th className="text-left px-6 py-3 font-medium text-gray-600">Amount</th>
          <th className="text-left px-6 py-3 font-medium text-gray-600">Description</th>
          <th className="text-left px-6 py-3 font-medium text-gray-600">Date</th>
        </tr></thead>
        <tbody className="divide-y divide-gray-50">
          {expenses.length === 0 ? <tr><td colSpan={4} className="text-center py-8 text-gray-400">No expenses</td></tr>
            : expenses.map((e) => (
              <tr key={e._id}>
                <td className="px-6 py-3">{e.category}</td>
                <td className="px-6 py-3 font-medium">₹{e.amount.toLocaleString()}</td>
                <td className="px-6 py-3 text-gray-500">{e.description || "—"}</td>
                <td className="px-6 py-3 text-gray-500">{new Date(e.date).toLocaleDateString()}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

function ComplaintsTab({ complaints, loading }: { complaints: Complaint[]; loading: boolean }) {
  if (loading) return <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" /></div>;
  return (
    <div className="space-y-3">
      {complaints.length === 0 ? <div className="card text-center text-gray-400 py-8">No complaints</div>
        : complaints.map((c) => (
          <div key={c._id} className="card">
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm text-gray-800 flex-1">{c.message}</p>
              <div className="flex items-center gap-2 flex-shrink-0">
                {c.is_anonymous && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Anonymous</span>}
                <StatusBadge status={c.status} />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">{new Date(c.createdAt).toLocaleString()}</p>
          </div>
        ))}
    </div>
  );
}
