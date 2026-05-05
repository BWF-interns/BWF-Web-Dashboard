'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/app/warden/Template/components/ui/alert-dialog';
import { Badge } from '@/app/warden/Template/components/ui/badge';
import { Button } from '@/app/warden/Template/components/ui/button';
import { Card, CardContent } from '@/app/warden/Template/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/warden/Template/components/ui/dialog';
import { Field, FieldLabel } from '@/app/warden/Template/components/ui/field';
import { Input } from '@/app/warden/Template/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/warden/Template/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/warden/Template/components/ui/table';
import { Textarea } from '@/app/warden/Template/components/ui/textarea';

const ITEMS_PER_PAGE = 10;
const DEPARTMENTS = ['Academic', 'Kitchen', 'Security', 'Housekeeping', 'Health', 'Administration', 'Maintenance'];
const SHIFTS = ['Morning', 'Evening', 'Night', 'Rotational'];
const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Volunteer'];
const STATUSES = ['Active', 'On Leave', 'Inactive'];

type Gender = 'male' | 'female' | 'other';
type StaffStatus = 'Active' | 'On Leave' | 'Inactive';
type Shift = 'Morning' | 'Evening' | 'Night' | 'Rotational';
type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Volunteer';

interface StaffMember {
  id: number;
  role: 'staff';
  roleName: string;
  name: string;
  gender: Gender;
  DOB: string;
  email: string;
  contactNumber: string;
  address: string;
  hostelName: string;
  department: string;
  employmentType: EmploymentType;
  shift: Shift;
  joiningDate: string;
  salary: string;
  status: StaffStatus;
  adhaarCard: string;
  panCard: string;
  emergencyContact: { name: string; phone: string; relation: string };
  notes: string;
}

interface StaffFormProps {
  data: StaffMember;
  onChange: (data: StaffMember) => void;
}

const emptyStaff: StaffMember = {
  id: 0,
  role: 'staff',
  roleName: 'Teacher',
  name: '',
  gender: 'male',
  DOB: '',
  email: '',
  contactNumber: '',
  address: '',
  hostelName: 'BWF Hostel',
  department: 'Academic',
  employmentType: 'Full-time',
  shift: 'Morning',
  joiningDate: '',
  salary: '',
  status: 'Active',
  adhaarCard: '',
  panCard: '',
  emergencyContact: { name: '', phone: '', relation: '' },
  notes: '',
};

const mockStaff: StaffMember[] = [
  { ...emptyStaff, id: 1, name: 'Meera Kapoor', roleName: 'Teacher', gender: 'female', DOB: '1991-04-18', email: 'meera.kapoor@bwf.org', contactNumber: '9811001001', department: 'Academic', joiningDate: '2022-06-12', salary: '42000', status: 'Active', emergencyContact: { name: 'Ravi Kapoor', phone: '9811001011', relation: 'Spouse' }, notes: 'Handles evening remedial classes.' },
  { ...emptyStaff, id: 2, name: 'Suresh Yadav', roleName: 'Cook', gender: 'male', DOB: '1986-01-05', email: '', contactNumber: '9811001002', department: 'Kitchen', shift: 'Morning', joiningDate: '2021-02-03', salary: '28000', status: 'Active', emergencyContact: { name: 'Kavita Yadav', phone: '9811001022', relation: 'Wife' }, notes: 'Breakfast and lunch lead.' },
  { ...emptyStaff, id: 3, name: 'Farah Ali', roleName: 'Nurse', gender: 'female', DOB: '1994-09-22', email: 'farah.ali@bwf.org', contactNumber: '9811001003', department: 'Health', shift: 'Rotational', joiningDate: '2023-08-10', salary: '36000', status: 'On Leave', emergencyContact: { name: 'Sameer Ali', phone: '9811001033', relation: 'Brother' }, notes: 'Maintains health records.' },
  { ...emptyStaff, id: 4, name: 'Mahesh Rawat', roleName: 'Security Guard', gender: 'male', DOB: '1982-12-11', email: '', contactNumber: '9811001004', department: 'Security', shift: 'Night', joiningDate: '2020-11-18', salary: '30000', status: 'Active', emergencyContact: { name: 'Pooja Rawat', phone: '9811001044', relation: 'Wife' }, notes: 'Night gate duty.' },
  { ...emptyStaff, id: 5, name: 'Lata Joshi', roleName: 'Cleaner', gender: 'female', DOB: '1989-07-30', email: '', contactNumber: '9811001005', department: 'Housekeeping', shift: 'Morning', joiningDate: '2022-01-15', salary: '23000', status: 'Active', emergencyContact: { name: 'Anil Joshi', phone: '9811001055', relation: 'Husband' }, notes: 'Assigned to south block.' },
  { ...emptyStaff, id: 6, name: 'Ramesh Pillai', roleName: 'Caretaker', gender: 'male', DOB: '1979-03-21', email: 'ramesh.pillai@bwf.org', contactNumber: '9811001006', department: 'Maintenance', shift: 'Evening', joiningDate: '2019-05-08', salary: '34000', status: 'Active', emergencyContact: { name: 'Devika Pillai', phone: '9811001066', relation: 'Daughter' }, notes: 'Coordinates repairs.' },
  { ...emptyStaff, id: 7, name: 'Anita Dsouza', roleName: 'Other Staff', gender: 'female', DOB: '1990-10-09', email: 'anita.dsouza@bwf.org', contactNumber: '9811001007', department: 'Administration', employmentType: 'Contract', shift: 'Morning', joiningDate: '2024-03-01', salary: '31000', status: 'Inactive', emergencyContact: { name: 'Maria Dsouza', phone: '9811001077', relation: 'Mother' }, notes: 'Documentation support.' },
];

const normalizeRoleName = (value: string) => value.trim().toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

const statusColor = (status: StaffStatus) => {
  if (status === 'Active') return 'bg-emerald-50 text-emerald-700 border-none';
  if (status === 'On Leave') return 'bg-amber-50 text-amber-700 border-none';
  return 'bg-slate-100 text-slate-600 border-none';
};

const StaffForm = ({ data, onChange }: StaffFormProps) => (
  <div className="p-6 space-y-8 text-[13px]">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Field><FieldLabel className="text-slate-700 font-bold mb-1.5 block text-[10px] uppercase tracking-wider">Full Name *</FieldLabel><Input value={data.name} onChange={(e) => onChange({ ...data, name: e.target.value })} placeholder="e.g. Meera Kapoor" className="h-10 rounded-xl bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-indigo-100 font-medium text-xs" /></Field>
      <Field><FieldLabel className="text-slate-700 font-bold mb-1.5 block text-[10px] uppercase tracking-wider">Role Name *</FieldLabel><Input value={data.roleName} onChange={(e) => onChange({ ...data, roleName: normalizeRoleName(e.target.value) })} placeholder="Teacher, Accountant, Driver..." className="h-10 rounded-xl bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-indigo-100 font-medium text-xs" /></Field>
      <Field><FieldLabel className="text-slate-700 font-bold mb-1.5 block text-[10px] uppercase tracking-wider">Department *</FieldLabel><Select value={data.department} onValueChange={(value) => onChange({ ...data, department: value })}><SelectTrigger className="h-10 rounded-xl bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-indigo-100 font-bold text-xs"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl">{DEPARTMENTS.map((department) => <SelectItem key={department} value={department}>{department}</SelectItem>)}</SelectContent></Select></Field>
      <Field><FieldLabel className="text-slate-700 font-bold mb-1.5 block text-[10px] uppercase tracking-wider">Gender *</FieldLabel><Select value={data.gender} onValueChange={(value: Gender) => onChange({ ...data, gender: value })}><SelectTrigger className="h-10 rounded-xl bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-indigo-100 font-bold text-xs"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl"><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select></Field>
      <Field><FieldLabel className="text-slate-700 font-bold mb-1.5 block text-[10px] uppercase tracking-wider">Phone *</FieldLabel><Input value={data.contactNumber} onChange={(e) => onChange({ ...data, contactNumber: e.target.value })} placeholder="10-digit number" className="h-10 rounded-xl bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-indigo-100 font-medium text-xs" /></Field>
      <Field><FieldLabel className="text-slate-700 font-bold mb-1.5 block text-[10px] uppercase tracking-wider">Email</FieldLabel><Input type="email" value={data.email} onChange={(e) => onChange({ ...data, email: e.target.value })} placeholder="Optional email" className="h-10 rounded-xl bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-indigo-100 font-medium text-xs" /></Field>
      <Field><FieldLabel className="text-slate-700 font-bold mb-1.5 block text-[10px] uppercase tracking-wider">Date of Birth</FieldLabel><Input type="date" value={data.DOB} onChange={(e) => onChange({ ...data, DOB: e.target.value })} className="h-10 rounded-xl bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-indigo-100 font-medium text-xs" /></Field>
      <Field><FieldLabel className="text-slate-700 font-bold mb-1.5 block text-[10px] uppercase tracking-wider">Joining Date *</FieldLabel><Input type="date" value={data.joiningDate} onChange={(e) => onChange({ ...data, joiningDate: e.target.value })} className="h-10 rounded-xl bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-indigo-100 font-medium text-xs" /></Field>
      <Field><FieldLabel className="text-slate-700 font-bold mb-1.5 block text-[10px] uppercase tracking-wider">Hostel</FieldLabel><Input value={data.hostelName} onChange={(e) => onChange({ ...data, hostelName: e.target.value })} className="h-10 rounded-xl bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-indigo-100 font-medium text-xs" /></Field>
      <Field><FieldLabel className="text-slate-700 font-bold mb-1.5 block text-[10px] uppercase tracking-wider">Employment Type</FieldLabel><Select value={data.employmentType} onValueChange={(value: EmploymentType) => onChange({ ...data, employmentType: value })}><SelectTrigger className="h-10 rounded-xl bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-indigo-100 font-bold text-xs"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl">{EMPLOYMENT_TYPES.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent></Select></Field>
      <Field><FieldLabel className="text-slate-700 font-bold mb-1.5 block text-[10px] uppercase tracking-wider">Shift</FieldLabel><Select value={data.shift} onValueChange={(value: Shift) => onChange({ ...data, shift: value })}><SelectTrigger className="h-10 rounded-xl bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-indigo-100 font-bold text-xs"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl">{SHIFTS.map((shift) => <SelectItem key={shift} value={shift}>{shift}</SelectItem>)}</SelectContent></Select></Field>
      <Field><FieldLabel className="text-slate-700 font-bold mb-1.5 block text-[10px] uppercase tracking-wider">Status</FieldLabel><Select value={data.status} onValueChange={(value: StaffStatus) => onChange({ ...data, status: value })}><SelectTrigger className="h-10 rounded-xl bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-indigo-100 font-bold text-xs"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl">{STATUSES.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}</SelectContent></Select></Field>
      <Field><FieldLabel className="text-slate-700 font-bold mb-1.5 block text-[10px] uppercase tracking-wider">Monthly Salary</FieldLabel><Input value={data.salary} onChange={(e) => onChange({ ...data, salary: e.target.value })} placeholder="Amount" className="h-10 rounded-xl bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-indigo-100 font-medium text-xs" /></Field>
      <Field className="md:col-span-2"><FieldLabel className="text-slate-700 font-bold mb-1.5 block text-[10px] uppercase tracking-wider">Address</FieldLabel><Input value={data.address} onChange={(e) => onChange({ ...data, address: e.target.value })} className="h-10 rounded-xl bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-indigo-100 font-medium text-xs" /></Field>
      <Field><FieldLabel className="text-slate-700 font-bold mb-1.5 block text-[10px] uppercase tracking-wider">Aadhaar</FieldLabel><Input value={data.adhaarCard} onChange={(e) => onChange({ ...data, adhaarCard: e.target.value })} className="h-10 rounded-xl bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-indigo-100 font-medium text-xs" /></Field>
      <Field><FieldLabel className="text-slate-700 font-bold mb-1.5 block text-[10px] uppercase tracking-wider">PAN</FieldLabel><Input value={data.panCard} onChange={(e) => onChange({ ...data, panCard: e.target.value })} className="h-10 rounded-xl bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-indigo-100 font-medium text-xs" /></Field>
    </div>

    <div className="pt-6 border-t border-slate-100">
      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Emergency Contact</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Field><FieldLabel className="text-slate-700 font-bold mb-1.5 block text-[9px] uppercase">Contact Name</FieldLabel><Input value={data.emergencyContact.name} onChange={(e) => onChange({ ...data, emergencyContact: { ...data.emergencyContact, name: e.target.value } })} className="h-9 rounded-lg bg-slate-50/50 text-xs font-medium border-none" /></Field>
        <Field><FieldLabel className="text-slate-700 font-bold mb-1.5 block text-[9px] uppercase">Contact Phone</FieldLabel><Input value={data.emergencyContact.phone} onChange={(e) => onChange({ ...data, emergencyContact: { ...data.emergencyContact, phone: e.target.value } })} className="h-9 rounded-lg bg-slate-50/50 text-xs font-medium border-none" /></Field>
        <Field><FieldLabel className="text-slate-700 font-bold mb-1.5 block text-[9px] uppercase">Relation</FieldLabel><Input value={data.emergencyContact.relation} onChange={(e) => onChange({ ...data, emergencyContact: { ...data.emergencyContact, relation: e.target.value } })} className="h-9 rounded-lg bg-slate-50/50 text-xs font-medium border-none" /></Field>
      </div>
    </div>

    <Field>
      <FieldLabel className="text-slate-700 font-bold mb-1.5 block text-[10px] uppercase tracking-wider">Notes</FieldLabel>
      <Textarea value={data.notes} onChange={(e) => onChange({ ...data, notes: e.target.value })} className="min-h-24 rounded-xl bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-indigo-100 font-medium text-xs" />
    </Field>
  </div>
);

export default function StaffPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleSearch, setRoleSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(mockStaff);
  const [formData, setFormData] = useState<StaffMember>(emptyStaff);

  const filteredStaff = useMemo(() => {
    return staffMembers
      .filter((staff) => {
        const query = searchTerm.toLowerCase();
        const matchesSearch = staff.name.toLowerCase().includes(query) || staff.contactNumber.includes(query) || staff.roleName.toLowerCase().includes(query);
        const matchesRole = !roleSearch.trim() || staff.roleName.toLowerCase().includes(roleSearch.trim().toLowerCase());
        const matchesStatus = statusFilter === 'all' || staff.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
      })
      .sort((a, b) => a.name.localeCompare(b.name) || a.roleName.localeCompare(b.roleName));
  }, [staffMembers, searchTerm, roleSearch, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredStaff.length / ITEMS_PER_PAGE));
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedStaff = filteredStaff.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const resetFiltersPage = () => setCurrentPage(1);

  const openAddDialog = () => {
    setFormData({ ...emptyStaff, id: Date.now(), role: 'staff', roleName: normalizeRoleName(emptyStaff.roleName) });
    setIsAddOpen(true);
  };

  const handleRowClick = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setFormData(staff);
    setIsDetailOpen(true);
  };

  const validateForm = () => {
    if (!formData.name || !formData.contactNumber || !formData.roleName || !formData.department || !formData.joiningDate) {
      alert('Required fields missing.');
      return false;
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert('Invalid email format.');
      return false;
    }
    if (formData.contactNumber.length < 10) {
      alert('Invalid contact number.');
      return false;
    }
    return true;
  };

  const handleRegister = () => {
    if (!validateForm()) return;
    setStaffMembers((current) => [{ ...formData, id: Date.now(), role: 'staff', roleName: normalizeRoleName(formData.roleName) }, ...current]);
    setIsAddOpen(false);
  };

  const handleSave = () => {
    if (!selectedStaff || !validateForm()) return;
    setStaffMembers((current) => current.map((staff) => (staff.id === selectedStaff.id ? { ...formData, role: 'staff', roleName: normalizeRoleName(formData.roleName) } : staff)));
    setIsDetailOpen(false);
  };

  const handleDelete = () => {
    if (!selectedStaff) return;
    setStaffMembers((current) => current.filter((staff) => staff.id !== selectedStaff.id));
    setIsDeleteConfirmOpen(false);
    setIsDetailOpen(false);
  };

  return (
    <div className="flex-1 p-4 md:p-6 bg-[#f8fafc] min-h-screen text-[13px]">
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Staff Management</h1>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1 font-medium">
            <span>Home</span> <span className="text-slate-300">/</span> <span className="text-indigo-500 font-semibold">Staff</span>
          </div>
        </div>
        <Button onClick={openAddDialog} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 px-8 text-xs font-bold shadow-md transition-all active:scale-95">
          <Plus className="w-4 h-4 mr-2" /> Add Staff
        </Button>
      </div>

      <Card className="border border-slate-200/60 shadow-none rounded-4xl bg-white overflow-hidden animate-scale-in">
        <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-50">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-700">Staff List</h2>
            <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-none font-bold px-2 py-0.5 rounded-md text-[10px]">{filteredStaff.length} Staff</Badge>
          </div>

          <div className="flex flex-1 items-center justify-end gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64 group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <Input placeholder="Search name, phone or role..." className="pl-10 h-10 bg-slate-50/50 border-slate-200 rounded-xl text-[12px] placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-indigo-100 font-medium transition-all" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); resetFiltersPage(); }} />
            </div>
            <div className="relative w-full md:w-40 group">
              <Input placeholder="Search role..." className="h-10 bg-white border-slate-200 rounded-xl text-[12px] placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-indigo-100 font-medium transition-all" value={roleSearch} onChange={(e) => { setRoleSearch(e.target.value); resetFiltersPage(); }} />
            </div>

            <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); resetFiltersPage(); }}>
              <SelectTrigger className="h-10 w-36 bg-white border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors px-4"><SelectValue placeholder="All Status" /></SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 shadow-xl"><SelectItem value="all">All Status</SelectItem>{STATUSES.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/10">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="py-4 px-8 font-bold text-slate-400 text-[11px] uppercase tracking-widest border-none">Name</TableHead>
                <TableHead className="py-4 px-8 font-bold text-slate-400 text-[11px] uppercase tracking-widest border-none">Role</TableHead>
                <TableHead className="py-4 px-8 font-bold text-slate-400 text-[11px] uppercase tracking-widest border-none">Department</TableHead>                <TableHead className="py-4 px-8 font-bold text-slate-400 text-[11px] uppercase tracking-widest border-none">Shift</TableHead>
                <TableHead className="py-4 px-8 font-bold text-slate-400 text-[11px] uppercase tracking-widest border-none">Status</TableHead>
                <TableHead className="py-4 px-8 font-bold text-slate-400 text-[11px] uppercase tracking-widest border-none">Phone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedStaff.length > 0 ? (
                paginatedStaff.map((staff) => (
                  <TableRow key={staff.id} onClick={() => handleRowClick(staff)} className="border-b border-slate-50/50 bg-white hover:bg-indigo-50/40 transition-colors duration-150 cursor-pointer group">
                    <TableCell className="py-4 px-8 font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{staff.name}</TableCell>
                    <TableCell className="py-4 px-8 text-slate-700 font-semibold">{staff.roleName}</TableCell>
                    <TableCell className="py-4 px-8 text-slate-600">{staff.department}</TableCell>                    <TableCell className="py-4 px-8 text-slate-600">{staff.shift}</TableCell>
                    <TableCell className="py-4 px-8"><Badge variant="outline" className={`${statusColor(staff.status)} font-bold px-2 py-0.5 rounded-md text-[10px]`}>{staff.status}</Badge></TableCell>
                    <TableCell className="py-4 px-8 text-slate-600 tracking-wider">{staff.contactNumber}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={6} className="py-20 text-center text-black font-medium italic">No staff found matching your criteria.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>

          <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-50">
            <div className="text-[11px] text-slate-400 font-bold tracking-tight uppercase">Showing {filteredStaff.length > 0 ? startIdx + 1 : 0} to {Math.min(startIdx + ITEMS_PER_PAGE, filteredStaff.length)} of {filteredStaff.length} staff</div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} disabled={currentPage === 1} className="w-9 h-9 rounded-xl hover:bg-slate-100"><ChevronLeft className="w-4 h-4" /></Button>
              <div className="flex items-center gap-1.5">{Array.from({ length: totalPages }).map((_, i) => <Button key={i + 1} variant={currentPage === i + 1 ? 'default' : 'ghost'} className={`w-9 h-9 rounded-xl text-[11px] font-bold p-0 transition-all ${currentPage === i + 1 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-100'}`} onClick={() => setCurrentPage(i + 1)}>{i + 1}</Button>)}</div>
              <Button variant="ghost" size="icon" onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="w-9 h-9 rounded-xl hover:bg-slate-100"><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] border-none shadow-2xl p-0 bg-white">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-10">
            <DialogHeader><DialogTitle className="text-xl font-bold text-slate-800 tracking-tight">Manage Staff Entry</DialogTitle></DialogHeader>
            <div className="flex gap-2"><Button variant="outline" onClick={() => setIsDeleteConfirmOpen(true)} className="rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50 h-10 px-6 font-bold text-xs transition-all">Delete Account</Button><Button onClick={handleSave} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white h-10 px-8 font-bold text-xs shadow-md transition-all">Update Staff</Button></div>
          </div>
          <StaffForm data={formData} onChange={setFormData} />
        </DialogContent>
      </Dialog>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] border-none shadow-2xl p-0 bg-white">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-10">
            <DialogHeader><DialogTitle className="text-xl font-bold text-slate-800 tracking-tight">Register New Staff</DialogTitle></DialogHeader>
            <div className="flex gap-2"><Button variant="ghost" onClick={() => setIsAddOpen(false)} className="rounded-xl h-10 px-6 text-xs font-bold text-slate-400 hover:bg-slate-50">Cancel</Button><Button onClick={handleRegister} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white h-10 px-10 font-bold text-xs shadow-lg shadow-indigo-100 transition-all">Complete Registration</Button></div>
          </div>
          <StaffForm data={formData} onChange={setFormData} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent className="rounded-3xl border-none p-8">
          <AlertDialogHeader><AlertDialogTitle className="text-xl font-heavy">Permanent Deletion?</AlertDialogTitle><AlertDialogDescription className="text-slate-500 font-medium">Are you sure you want to remove {selectedStaff?.name}? This cannot be reverted.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3"><AlertDialogCancel className="rounded-xl border-none bg-slate-100 text-slate-600 font-bold">Nevermind</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold px-8">Confirm Deletion</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}




