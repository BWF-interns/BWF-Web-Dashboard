'use client';

import { useMemo, useState } from 'react';
import { Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface Activity {
  id: number;
  title: string;
  description: string;
  requestedBy: string;
  requesterRole: 'Student' | 'Teacher' | 'Warden';
  dateTime: string;
  location: string;
  participants: number;
  category: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  rejectionReason?: string;
}

const STATUS_OPTIONS = ['All', 'Pending', 'Approved', 'Rejected'];
const CATEGORY_OPTIONS = ['All', 'Cultural', 'Sports', 'Technical', 'Academic', 'Social', 'Entertainment'];

export default function ActivitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 1,
      title: 'Birthday Celebration',
      description: 'Birthday celebration for Aditya with friends',
      requestedBy: 'Aditya Kumar',
      requesterRole: 'Student',
      dateTime: '2026-04-15 18:00',
      location: 'B Block Common Room',
      participants: 25,
      category: 'Social',
      status: 'Pending',
    },
    {
      id: 2,
      title: 'Movie Night',
      description: 'Screening of latest Bollywood movie',
      requestedBy: 'Entertainment Club',
      requesterRole: 'Student',
      dateTime: '2026-04-20 20:00',
      location: 'A Block Hall',
      participants: 100,
      category: 'Entertainment',
      status: 'Pending',
    },
    {
      id: 3,
      title: 'Yoga Session',
      description: 'Morning yoga and meditation class',
      requestedBy: 'Wellness Club',
      requesterRole: 'Student',
      dateTime: '2026-04-12 06:30',
      location: 'Gymnasium',
      participants: 30,
      category: 'Social',
      status: 'Approved',
    },
    {
      id: 4,
      title: 'Tech Workshop',
      description: 'Introduction to web development',
      requestedBy: 'Technical Team',
      requesterRole: 'Teacher',
      dateTime: '2026-04-10 15:00',
      location: 'Computer Lab',
      participants: 45,
      category: 'Technical',
      status: 'Approved',
    },
    {
      id: 5,
      title: 'Art Exhibition',
      description: 'Student artwork showcase',
      requestedBy: 'Art Society',
      requesterRole: 'Student',
      dateTime: '2026-04-18 10:00',
      location: 'Main Hall',
      participants: 150,
      category: 'Cultural',
      status: 'Approved',
    },
    {
      id: 6,
      title: 'Debate Competition',
      description: 'Inter-class debate championship',
      requestedBy: 'Debate Club',
      requesterRole: 'Student',
      dateTime: '2026-04-25 16:00',
      location: 'Auditorium',
      participants: 60,
      category: 'Academic',
      status: 'Rejected',
      rejectionReason: 'The proposal exceeds budget and requires revision.',
    },
    {
      id: 7,
      title: 'Music Concert',
      description: 'Annual music concert featuring student bands',
      requestedBy: 'Music Club',
      requesterRole: 'Student',
      dateTime: '2026-04-28 19:00',
      location: 'Open Air Theatre',
      participants: 200,
      category: 'Cultural',
      status: 'Pending',
    },
    {
      id: 8,
      title: 'Career Fair',
      description: 'Industry professionals meet with students',
      requestedBy: 'Placement Cell',
      requesterRole: 'Teacher',
      dateTime: '2026-04-30 10:00',
      location: 'Main Auditorium',
      participants: 300,
      category: 'Academic',
      status: 'Approved',
    },
    {
      id: 9,
      title: 'Photography Workshop',
      description: 'Learn professional photography techniques',
      requestedBy: 'Photography Society',
      requesterRole: 'Student',
      dateTime: '2026-05-02 14:00',
      location: 'Media Lab',
      participants: 25,
      category: 'Technical',
      status: 'Pending',
    },
    {
      id: 10,
      title: 'Sports Tournament',
      description: 'Inter-hostel cricket championship',
      requestedBy: 'Sports Committee',
      requesterRole: 'Student',
      dateTime: '2026-05-05 09:00',
      location: 'Sports Ground',
      participants: 150,
      category: 'Sports',
      status: 'Approved',
    },
  ]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [newActivity, setNewActivity] = useState({
    title: '',
    description: '',
    requestedBy: 'you',
    requesterRole: 'Warden' as Activity['requesterRole'],
    dateTime: '',
    location: '',
    participants: 0,
    category: 'Cultural',
  });

  const filteredActivities = useMemo(
    () =>
      activities.filter((activity) => {
        const matchesSearch = [activity.title, activity.description, activity.requestedBy, activity.location]
          .join(' ')
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || activity.status === statusFilter;
        const matchesCategory = categoryFilter === 'All' || activity.category === categoryFilter;
        return matchesSearch && matchesStatus && matchesCategory;
      }),
    [activities, searchTerm, statusFilter, categoryFilter]
  );

  const ITEMS_PER_PAGE = 8;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(filteredActivities.length / ITEMS_PER_PAGE));
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedActivities = filteredActivities.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const openApprove = (activity: Activity) => {
    setSelectedActivity(activity);
    setApproveOpen(true);
  };

  const openReject = (activity: Activity) => {
    setSelectedActivity(activity);
    setRejectReason('');
    setRejectOpen(true);
  };

  const confirmApprove = () => {
    if (!selectedActivity) return;
    setActivities((prev) => prev.map((item) => item.id === selectedActivity.id ? { ...item, status: 'Approved' } : item));
    setApproveOpen(false);
  };

  const confirmReject = () => {
    if (!selectedActivity || !rejectReason.trim()) return;
    setActivities((prev) => prev.map((item) =>
      item.id === selectedActivity.id
        ? { ...item, status: 'Rejected', rejectionReason: rejectReason }
        : item
    ));
    setRejectOpen(false);
    setRejectReason('');
  };

  const openCreate = () => {
    setNewActivity({
      title: '',
      description: '',
      requestedBy: 'you',
      requesterRole: 'Warden',
      dateTime: '',
      location: '',
      participants: 0,
      category: 'Cultural',
    });
    setCreateOpen(true);
  };

  const submitCreate = () => {
    if (!newActivity.title || !newActivity.dateTime || !newActivity.location) return;
    setActivities((prev) => [
      {
        id: prev.length ? Math.max(...prev.map((item) => item.id)) + 1 : 1,
        status: newActivity.requesterRole === 'Warden' ? 'Approved' : 'Pending',
        ...newActivity,
      },
      ...prev,
    ]);
    setCreateOpen(false);
  };

  return (
    <div className="flex-1 p-4 md:p-6 bg-[#f8fafc] min-h-screen text-[13px]">
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Activity Management</h1>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1 font-medium">
            <span>Home</span>
            <span className="text-slate-300">/</span>
            <span className="text-indigo-500 font-semibold">Activities</span>
          </div>
        </div>
        <Button onClick={openCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 px-8 text-xs font-bold shadow-md transition-all active:scale-95">
          <Plus className="w-4 h-4 mr-2" /> Create Activity
        </Button>
      </div>

      <Card className="rounded-4xl border border-slate-200/60 bg-white shadow-none">
        <div className="lg:p-6 border-b border-slate-100">
            <div className="grid gap-4 xl:grid-cols-[1.8fr_1fr] xl:items-end">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, organizer, or location"
                  className="pl-12 h-12 rounded-2xl border-slate-200 bg-slate-50 text-sm"
                />
              </div>

              <div className="grid gap-3  sm:grid-cols-2">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 mb-2">Status</p>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50 px-4 text-sm text-slate-600"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                      {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 mb-2">Category</p>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50 px-4 text-sm text-slate-600"><SelectValue placeholder="Category" /></SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                      {CATEGORY_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
        </div>

        <CardContent className="pt-2 pb-4 space-y-3">
          {filteredActivities.length === 0 ? (
            <div className="rounded-4xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
              No activities match your search or filters.
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedActivities.map((activity) => (
                <div key={activity.id} className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-semibold text-slate-900">{activity.title}</h2>
                        <Badge className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                          activity.status === 'Approved'
                            ? 'bg-green-50 text-green-700 border border-green-100'
                            : activity.status === 'Rejected'
                            ? 'bg-red-50 text-red-700 border border-red-100'
                            : 'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}>{activity.status}</Badge>
                        <Badge className="rounded-full px-3 py-1 text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">{activity.category}</Badge>
                        <Badge className="rounded-full px-3 py-1 text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">{activity.requesterRole}</Badge>
                      </div>
                      <p className="mt-4 text-sm leading-6 text-slate-600">{activity.description}</p>
                      {activity.rejectionReason && (
                        <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700 border border-red-100">
                          <p className="font-semibold text-slate-900">Rejection reason</p>
                          <p className="mt-1 text-slate-700">{activity.rejectionReason}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      {activity.status === 'Pending' && (
                        <>
                          <Button onClick={() => openApprove(activity)} size="sm" className="h-10 rounded-xl bg-green-600 px-4 text-sm font-bold text-white hover:bg-green-700">Approve</Button>
                          <Button onClick={() => openReject(activity)} size="sm" variant="outline" className="h-10 rounded-xl border-red-200 text-red-600 hover:bg-red-600 hover:text-white">Reject</Button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Requested By</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">{activity.requesterRole === 'Warden' ? 'you' : activity.requestedBy}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Date & Time</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">{formatDateTime(activity.dateTime)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Location</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">{activity.location}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Participants</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">{activity.participants}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredActivities.length > ITEMS_PER_PAGE && (
            <div className="p-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-t border-slate-100">
              <p className="text-xs text-slate-500">
                Showing {filteredActivities.length > 0 ? startIdx + 1 : 0} to {Math.min(startIdx + ITEMS_PER_PAGE, filteredActivities.length)} of {filteredActivities.length} activities
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="w-7 h-7 rounded-lg hover:bg-slate-100"
                >
                  <ChevronLeft className="w-3 h-3" />
                </Button>
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, index) => (
                    <Button
                      key={index}
                      variant={currentPage === index + 1 ? 'default' : 'ghost'}
                      className={`w-6 h-6 rounded-lg text-[10px] font-bold p-0 transition-all ${
                        currentPage === index + 1 ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'
                      }`}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="w-7 h-7 rounded-lg hover:bg-slate-100"
                >
                  <ChevronRight className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent className="max-w-2xl rounded-[2.5rem] border-none shadow-2xl p-0 bg-white">
          <div className="p-8 border-b border-slate-50">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-800 tracking-tight">Confirm Approval</DialogTitle>
              <DialogDescription>Approve this activity request?</DialogDescription>
            </DialogHeader>
          </div>
          {selectedActivity && (
            <div className="p-8 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Title</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{selectedActivity.title}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Requested By</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{selectedActivity.requestedBy}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Date & Time</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{formatDateTime(selectedActivity.dateTime)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Location</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{selectedActivity.location}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="p-8 border-t border-slate-50 flex flex-col sm:flex-row gap-3 justify-end">
            <Button variant="outline" onClick={() => setApproveOpen(false)} className="rounded-xl h-10 px-6 text-xs font-bold">Cancel</Button>
            <Button onClick={confirmApprove} className="rounded-xl bg-green-600 hover:bg-green-700 text-white h-10 px-8 font-bold text-xs">Confirm Approval</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="max-w-md rounded-[2.5rem] border-none shadow-2xl p-0 bg-white">
          <div className="p-6 border-b border-slate-50">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-800 tracking-tight">Reject Activity</DialogTitle>
              <DialogDescription className="text-sm">Provide a reason for rejecting this activity.</DialogDescription>
            </DialogHeader>
          </div>
          {selectedActivity && (
            <div className="p-6 space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Title</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{selectedActivity.title}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Rejection Reason</p>
                <Textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Enter a reason for rejection"
                  className="h-20 rounded-xl bg-slate-50 border-slate-200 text-sm"
                />
              </div>
            </div>
          )}
          <DialogFooter className="p-6 border-t border-slate-50 flex flex-col sm:flex-row gap-3 justify-end">
            <Button variant="outline" onClick={() => setRejectOpen(false)} className="rounded-xl h-10 px-6 text-xs font-bold">Cancel</Button>
            <Button disabled={!rejectReason.trim()} onClick={confirmReject} className="rounded-xl bg-red-600 hover:bg-red-700 text-white h-10 px-8 font-bold text-xs disabled:opacity-50">Confirm Rejection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="w-[min(100vw-1rem,24rem)] max-w-md rounded-[2.5rem] border-none shadow-2xl p-0 bg-white max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="p-6 border-b border-slate-50">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-800 tracking-tight">Create Activity</DialogTitle>
              <DialogDescription className="text-sm">Fill details and submit a new activity request.</DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400 mb-2">Title</p>
              <Input value={newActivity.title} onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })} placeholder="Activity title" className="h-12 rounded-xl bg-slate-50 border-slate-200 text-sm" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400 mb-2">Description</p>
              <Textarea value={newActivity.description} onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })} placeholder="Activity details (optional)" maxLength={300} className="h-16 rounded-xl bg-slate-50 border-slate-200 text-sm" />
              <p className="mt-1 text-[11px] text-slate-400">Optional • keep it within 100 words.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400 mb-2">Date & Time</p>
                <Input type="datetime-local" value={newActivity.dateTime} onChange={(e) => setNewActivity({ ...newActivity, dateTime: e.target.value })} className="h-12 rounded-xl bg-slate-50 border-slate-200 text-sm" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400 mb-2">Location</p>
                <Input value={newActivity.location} onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })} placeholder="Activity location" className="h-12 rounded-xl bg-slate-50 border-slate-200 text-sm" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400 mb-2">Participants</p>
                <Input type="number" value={newActivity.participants} onChange={(e) => setNewActivity({ ...newActivity, participants: Number(e.target.value) })} placeholder="Number of participants" className="h-12 rounded-xl bg-slate-50 border-slate-200 text-sm" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400 mb-2">Category</p>
                <Select value={newActivity.category} onValueChange={(value) => setNewActivity({ ...newActivity, category: value })}>
                  <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50 px-4 text-sm text-slate-600"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                    {CATEGORY_OPTIONS.filter((option) => option !== 'All').map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="p-4 border-t border-slate-50 flex flex-col sm:flex-row gap-3 justify-end">
            <Button variant="outline" onClick={() => setCreateOpen(false)} className="rounded-xl h-10 px-6 text-xs font-bold">Cancel</Button>
            <Button onClick={submitCreate} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white h-10 px-8 font-bold text-xs">Create Activity</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
