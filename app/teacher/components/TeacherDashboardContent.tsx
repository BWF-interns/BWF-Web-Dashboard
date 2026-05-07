"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CalendarClock,
  FileCheck2,
  GraduationCap,
  HeartPulse,
  MessageSquareText,
  Send,
  UserCheck,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import { PremiumStatCard } from "@/app/teacher/Template/components/premium-stat-card";
import { Button } from "@/app/teacher/Template/components/ui/button";
import { Input } from "@/app/teacher/Template/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/teacher/Template/components/ui/table";
import {
  addAssignment,
  addSchedule,
  assignMentor,
  getStudentOverview,
  getAssignmentProgress,
  getSubmissions,
  getTeacherDashboard,
  pushMentorNote,
  reviewSubmission,
  updateResource,
} from "../service";
import type {
  AssignmentProgressResponse,
  StudentOverview,
  TeacherDashboardResponse,
} from "../types";
import {
  getMockAssignmentProgress,
  getMockOverview,
  mockResourceFormDefaults,
  MOCK_TEACHER_DASHBOARD,
} from "../dashboard/teacherDashboardMock";

export type TeacherView = "dashboard" | "students" | "submissions" | "resources";

const defaultState: TeacherDashboardResponse = {
  students: [],
  resources: [],
  pendingSubmissions: [],
};

function hasAuthToken() {
  return typeof window !== "undefined" && !!localStorage.getItem("accessToken");
}

const titles: Record<
  TeacherView,
  { heading: string; sub: string }
> = {
  dashboard: {
    heading: "Teacher Dashboard",
    sub: "Manage mentorship, academics, resources and submission verification from one place.",
  },
  students: {
    heading: "Students",
    sub: "Select a learner, assign work, push schedules, mentor notes, and track progress.",
  },
  submissions: {
    heading: "Submissions",
    sub: "Verify student submissions — approve or request changes with a note.",
  },
  resources: {
    heading: "Resources",
    sub: "Update library, syllabus, and mentor contact links shown on the student dashboard.",
  },
};

const SoftCard = ({ children, className = "", title, subtitle, icon: Icon, theme = "white" }: any) => {
  const themeClasses = {
    white: "bg-white/90 border-white/60",
    pink: "bg-[#FDF2F8] border-pink-100/50",
    green: "bg-[#F0FDF4] border-green-100/50",
    blue: "bg-[#EFF6FF] border-blue-100/50",
    purple: "bg-[#FAF5FF] border-purple-100/50",
    yellow: "bg-[#FEFCE8] border-yellow-100/50"
  };

  return (
    <div className={`rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl border ${themeClasses[theme as keyof typeof themeClasses]} ${className} transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1`}>
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              {Icon && <Icon className="w-5 h-5 text-slate-700" />} {title}
            </h3>
          )}
          {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

const statusMap = {
  "not_submitted": { label: "To Do Right Now", color: "bg-blue-100 text-blue-700", icon: Clock },
  "pending": { label: "Under Review", color: "bg-yellow-100 text-yellow-700", icon: AlertCircle },
  "approved": { label: "Verified & Finished", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  "rejected": { label: "Needs Revision", color: "bg-red-100 text-red-700", icon: AlertCircle }
};

type Props = {
  view: TeacherView;
  /** Where to send users after sign-in (per-route). */
  signInRedirectHref?: string;
};

export function TeacherDashboardContent({
  view,
  signInRedirectHref = "/auth/login?redirect=/teacher/dashboard",
}: Props) {
  const [data, setData] = useState<TeacherDashboardResponse>(defaultState);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [overview, setOverview] = useState<StudentOverview | null>(null);
  const [assignmentProgress, setAssignmentProgress] =
    useState<AssignmentProgressResponse | null>(null);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [liveApi, setLiveApi] = useState(false);

  const [assignmentForm, setAssignmentForm] = useState({
    title: "",
    subject: "",
    dueDate: "",
    priority: "medium",
  });

  const [scheduleForm, setScheduleForm] = useState({
    title: "",
    sessionType: "class",
    date: "",
    startTime: "",
    joinLink: "",
  });

  const [noteMessage, setNoteMessage] = useState("");
  const [mentorName, setMentorName] = useState("Teacher");
  const [resourceForm, setResourceForm] = useState({
    library: "",
    syllabus: "",
    contactMentor: "",
  });

  const showStats = true;
  const showStudentBlock =
    view === "dashboard" || view === "students";
  const showAssignmentSchedule =
    view === "dashboard" || view === "students";
  const showMentorship =
    view === "dashboard" || view === "students";
  const showResourcesCard =
    view === "dashboard" || view === "resources";
  const showSubmissionsQueue =
    view === "dashboard" || view === "submissions";
  const showProgress =
    view === "dashboard" || view === "students";
  const showPerformance =
    view === "dashboard" || view === "students";

  function applyDemoDashboard() {
    setLiveApi(false);
    setData(MOCK_TEACHER_DASHBOARD);
    setResourceForm(mockResourceFormDefaults());
    const firstId = MOCK_TEACHER_DASHBOARD.students[0]?.auth_id ?? "";
    setSelectedStudent(firstId);
    setOverview(firstId ? getMockOverview(firstId) : null);
    setAssignmentProgress(firstId ? getMockAssignmentProgress(firstId) : null);
    setMessage("");
  }

  async function refreshData() {
    try {
      const [dashboard, submissions] = await Promise.all([
        getTeacherDashboard(),
        getSubmissions("pending"),
      ]);
      setLiveApi(true);
      setData({
        ...dashboard,
        pendingSubmissions: submissions,
      });
      const resourceMap = {
        library: "",
        syllabus: "",
        contactMentor: "",
      };
      dashboard.resources.forEach((r) => {
        resourceMap[r.key as keyof typeof resourceMap] = r.value;
      });
      setResourceForm(resourceMap);
      const authIds = dashboard.students.map((s) => s.auth_id);
      if (
        authIds.length > 0 &&
        (!selectedStudent || !authIds.includes(selectedStudent))
      ) {
        setSelectedStudent(authIds[0]);
      }
    } catch {
      setMessage("Could not load live data. Showing demo preview.");
      applyDemoDashboard();
    }
  }

  useEffect(() => {
    refreshData().catch(() => {
      setMessage("Could not load dashboard");
      applyDemoDashboard();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedStudent) return;
    Promise.all([
      getStudentOverview(selectedStudent),
      getAssignmentProgress(selectedStudent),
    ])
      .then(([overviewRes, progressRes]) => {
        setOverview(overviewRes);
        setAssignmentProgress(progressRes);
      })
      .catch(() => setMessage("Could not load student overview"));
  }, [selectedStudent, liveApi]);

  const studentOptions = useMemo(() => data.students, [data.students]);

  async function handleAssignmentCreate() {
    if (!selectedStudent) return setMessage("Select a student first");
    try {
      setIsSaving(true);
      await addAssignment(selectedStudent, assignmentForm);
      setMessage("Assignment added successfully.");
      setAssignmentForm({ title: "", subject: "", dueDate: "", priority: "medium" });
      setOverview(await getStudentOverview(selectedStudent));
      setAssignmentProgress(await getAssignmentProgress(selectedStudent));
    } catch {
      setMessage("Could not add assignment.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSchedulePush() {
    if (!selectedStudent) return setMessage("Select a student first");
    try {
      setIsSaving(true);
      await addSchedule(selectedStudent, scheduleForm);
      setMessage("Academic schedule pushed.");
      setScheduleForm({
        title: "",
        sessionType: "class",
        date: "",
        startTime: "",
        joinLink: "",
      });
    } catch {
      setMessage("Could not push schedule.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleMentorNote() {
    if (!selectedStudent) return setMessage("Select a student first");
    try {
      setIsSaving(true);
      await assignMentor(selectedStudent, mentorName);
      await pushMentorNote(selectedStudent, noteMessage, mentorName);
      setNoteMessage("");
      setMessage("Mentorship and note updated.");
    } catch {
      setMessage("Could not push mentorship note.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleResourceSave() {
    try {
      setIsSaving(true);
      await Promise.all([
        updateResource("library", resourceForm.library),
        updateResource("syllabus", resourceForm.syllabus),
        updateResource("contactMentor", resourceForm.contactMentor),
      ]);
      setMessage("Student dashboard resources updated.");
    } catch {
      setMessage("Could not update resources.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleReview(submissionId: string, status: "approved" | "rejected") {
    try {
      const rejectionNote =
        status === "rejected" ? "Please improve based on rubric and resubmit." : "";
      await reviewSubmission(submissionId, { status, rejectionNote });
      setMessage(`Submission ${status}.`);
      await refreshData();
    } catch {
      setMessage("Could not review submission.");
    }
  }

  const { heading, sub } = titles[view];

  return (
    <main className="flex-1 overflow-auto bg-[#F8FAFC] min-h-screen">
      <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
        <div className="animate-fade-in">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#e0f2fe] via-[#f0fdf4] to-[#fce4ec] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                  {heading} <span className="text-2xl">👋</span>
                </h1>
                <p className="text-slate-600 font-medium">{sub}</p>
                {message ? <p className="text-sm mt-3 text-blue-600 font-semibold bg-white/50 inline-block px-3 py-1 rounded-full">{message}</p> : null}
              </div>
              
              <div className="flex gap-3 bg-white/60 p-3 rounded-2xl backdrop-blur-sm border border-white/40 shadow-sm">
                <div className="flex flex-col items-center justify-center bg-white w-14 h-14 rounded-xl shadow-sm">
                  <span className="text-2xl">😊</span>
                  <span className="text-[10px] font-bold text-slate-500 mt-1">Happy</span>
                </div>
                <div className="flex flex-col items-center justify-center bg-white w-14 h-14 rounded-xl shadow-sm">
                  <span className="text-2xl">😐</span>
                  <span className="text-[10px] font-bold text-slate-500 mt-1">Okay</span>
                </div>
                <div className="flex flex-col items-center justify-center bg-white w-14 h-14 rounded-xl shadow-sm">
                  <span className="text-2xl">😨</span>
                  <span className="text-[10px] font-bold text-slate-500 mt-1">Help</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showStats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <PremiumStatCard
              icon={GraduationCap}
              label="Assigned Students"
              value={data.students.length}
              color="primary"
            />
            <PremiumStatCard
              icon={FileCheck2}
              label="Pending Reviews"
              value={data.pendingSubmissions.length}
              color="warning"
            />
            <PremiumStatCard
              icon={BookOpen}
              label="Active Resources"
              value={data.resources.length}
              color="success"
            />
            <PremiumStatCard
              icon={HeartPulse}
              label="Mood Logs (sample)"
              value={overview?.moods.length || 0}
              color="danger"
            />
          </div>
        ) : null}

        {showStudentBlock ? (
          <SoftCard title="Student Context" subtitle="Select a student to run mentor and academic actions." theme="white">
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full rounded-2xl border-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] bg-slate-50 px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
            >
              <option value="">Choose student...</option>
              {studentOptions.map((s) => (
                <option key={s._id} value={s.auth_id}>
                  {s.name} ({s.auth_id})
                </option>
              ))}
            </select>
          </SoftCard>
        ) : null}

        {showAssignmentSchedule ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <SoftCard title="Assignment Management" subtitle="Create and assign tasks to selected student." icon={GraduationCap} theme="white">
              <div className="space-y-4">
                <Input
                  placeholder="Assignment title (e.g. Science Project)"
                  value={assignmentForm.title}
                  onChange={(e) =>
                    setAssignmentForm({ ...assignmentForm, title: e.target.value })
                  }
                  className="rounded-2xl border-none bg-slate-50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] px-4 py-6"
                />
                <Input
                  placeholder="Subject"
                  value={assignmentForm.subject}
                  onChange={(e) =>
                    setAssignmentForm({ ...assignmentForm, subject: e.target.value })
                  }
                  className="rounded-2xl border-none bg-slate-50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] px-4 py-6"
                />
                <Input
                  type="date"
                  value={assignmentForm.dueDate}
                  onChange={(e) =>
                    setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })
                  }
                  className="rounded-2xl border-none bg-slate-50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] px-4 py-6 text-slate-500"
                />
                <select
                  className="w-full rounded-2xl border-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] bg-slate-50 px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 text-slate-500"
                  value={assignmentForm.priority}
                  onChange={(e) =>
                    setAssignmentForm({ ...assignmentForm, priority: e.target.value })
                  }
                >
                  <option value="high">High priority</option>
                  <option value="medium">Medium priority</option>
                  <option value="low">Low priority</option>
                </select>
                <Button
                  onClick={handleAssignmentCreate}
                  disabled={isSaving}
                  className="w-full rounded-full py-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold mt-2"
                >
                  <Send className="w-4 h-4 mr-2" /> Assign to Student
                </Button>
              </div>
            </SoftCard>

            <SoftCard title="Academic Schedule" subtitle="Push sessions directly to student dashboard schedule card." icon={CalendarClock} theme="blue">
              <div className="space-y-4">
                <Input
                  placeholder="Session title"
                  value={scheduleForm.title}
                  onChange={(e) =>
                    setScheduleForm({ ...scheduleForm, title: e.target.value })
                  }
                  className="rounded-2xl border-none bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] px-4 py-6"
                />
                <Input
                  placeholder="Session type (class/workshop/training)"
                  value={scheduleForm.sessionType}
                  onChange={(e) =>
                    setScheduleForm({ ...scheduleForm, sessionType: e.target.value })
                  }
                  className="rounded-2xl border-none bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] px-4 py-6"
                />
                <Input
                  type="date"
                  value={scheduleForm.date}
                  onChange={(e) =>
                    setScheduleForm({ ...scheduleForm, date: e.target.value })
                  }
                  className="rounded-2xl border-none bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] px-4 py-6 text-slate-500"
                />
                <Input
                  placeholder="Start time (e.g. 10:00 AM)"
                  value={scheduleForm.startTime}
                  onChange={(e) =>
                    setScheduleForm({ ...scheduleForm, startTime: e.target.value })
                  }
                  className="rounded-2xl border-none bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] px-4 py-6"
                />
                <Input
                  placeholder="Join link (optional)"
                  value={scheduleForm.joinLink}
                  onChange={(e) =>
                    setScheduleForm({ ...scheduleForm, joinLink: e.target.value })
                  }
                  className="rounded-2xl border-none bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] px-4 py-6"
                />
                <Button
                  onClick={handleSchedulePush}
                  disabled={isSaving}
                  className="w-full rounded-full py-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold mt-2"
                >
                  <Send className="w-4 h-4 mr-2" /> Push Schedule
                </Button>
              </div>
            </SoftCard>
          </div>
        ) : null}

        {showMentorship || showResourcesCard ? (
          <div
            className={`grid grid-cols-1 gap-6 ${view === "dashboard" ? "xl:grid-cols-2" : ""}`}
          >
            {showMentorship ? (
              <SoftCard title="Mentorship & Notes" subtitle="Assign mentor context and push note to the student dashboard." icon={UserCheck} theme="pink">
                <div className="space-y-4">
                  <Input
                    placeholder="Mentor display name"
                    value={mentorName}
                    onChange={(e) => setMentorName(e.target.value)}
                    className="rounded-2xl border-none bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] px-4 py-6"
                  />
                  <textarea
                    className="w-full min-h-32 rounded-3xl border-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] bg-white px-5 py-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-pink-500/50 resize-none"
                    placeholder="Write an inspiring note to the student..."
                    value={noteMessage}
                    onChange={(e) => setNoteMessage(e.target.value)}
                  />
                  <Button
                    onClick={handleMentorNote}
                    disabled={isSaving}
                    className="w-full rounded-full py-6 bg-pink-500 hover:bg-pink-600 text-white font-semibold shadow-md shadow-pink-200 mt-2"
                  >
                    <MessageSquareText className="w-4 h-4 mr-2" /> Push Note
                  </Button>
                </div>
              </SoftCard>
            ) : null}

            {showResourcesCard ? (
              <SoftCard title="Dynamic Resources" subtitle="Update links visible in student quick resources section." icon={BookOpen} theme="white">
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-purple-400"></div>
                    <Input
                      placeholder="Library link"
                      value={resourceForm.library}
                      onChange={(e) =>
                        setResourceForm({ ...resourceForm, library: e.target.value })
                      }
                      className="rounded-2xl border-none bg-purple-50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] px-10 py-6 text-purple-900 placeholder:text-purple-300"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-green-400"></div>
                    <Input
                      placeholder="Syllabus download link"
                      value={resourceForm.syllabus}
                      onChange={(e) =>
                        setResourceForm({ ...resourceForm, syllabus: e.target.value })
                      }
                      className="rounded-2xl border-none bg-green-50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] px-10 py-6 text-green-900 placeholder:text-green-300"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-pink-400"></div>
                    <Input
                      placeholder="Mentor contact details/link"
                      value={resourceForm.contactMentor}
                      onChange={(e) =>
                        setResourceForm({ ...resourceForm, contactMentor: e.target.value })
                      }
                      className="rounded-2xl border-none bg-pink-50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] px-10 py-6 text-pink-900 placeholder:text-pink-300"
                    />
                  </div>
                  <Button
                    onClick={handleResourceSave}
                    disabled={isSaving}
                    className="w-full rounded-full py-6 bg-slate-800 hover:bg-slate-900 text-white font-semibold mt-2"
                  >
                    Save Resource Configuration
                  </Button>
                </div>
              </SoftCard>
            ) : null}
          </div>
        ) : null}

        {showProgress ? (
          <SoftCard title="Student Assignment Progress" subtitle="Status tracking corresponding exactly to the student's 'Today's Work' view." theme="white">
            {!assignmentProgress ? (
              <div className="py-8 text-center bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
                <p className="text-sm text-slate-500">
                  Select a student to view their assignment progress tracking.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 text-center">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Total</p>
                    <p className="text-2xl font-bold text-slate-800">{assignmentProgress.summary.total}</p>
                  </div>
                  <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4 text-center">
                    <p className="text-xs text-blue-600 uppercase tracking-wider font-semibold mb-1">To Do</p>
                    <p className="text-2xl font-bold text-blue-800">
                      {assignmentProgress.summary.not_submitted}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-yellow-50 border border-yellow-100 p-4 text-center">
                    <p className="text-xs text-yellow-600 uppercase tracking-wider font-semibold mb-1">Review</p>
                    <p className="text-2xl font-bold text-yellow-800">{assignmentProgress.summary.pending}</p>
                  </div>
                  <div className="rounded-2xl bg-green-50 border border-green-100 p-4 text-center">
                    <p className="text-xs text-green-600 uppercase tracking-wider font-semibold mb-1">Verified</p>
                    <p className="text-2xl font-bold text-green-800">{assignmentProgress.summary.approved}</p>
                  </div>
                  <div className="rounded-2xl bg-red-50 border border-red-100 p-4 text-center">
                    <p className="text-xs text-red-600 uppercase tracking-wider font-semibold mb-1">Needs Rev</p>
                    <p className="text-2xl font-bold text-red-800">{assignmentProgress.summary.rejected}</p>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-slate-100 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-50/80">
                      <TableRow className="border-b border-slate-100">
                        <TableHead className="py-4 text-slate-600">Assignment Title</TableHead>
                        <TableHead className="py-4 text-slate-600">Subject</TableHead>
                        <TableHead className="py-4 text-slate-600">Due Date</TableHead>
                        <TableHead className="py-4 text-slate-600">Progress Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assignmentProgress.assignments.map((item) => {
                        const statusDef = statusMap[item.progressStatus as keyof typeof statusMap] || statusMap["not_submitted"];
                        const StatusIcon = statusDef.icon;
                        return (
                          <TableRow key={item.assignment_id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                            <TableCell className="py-4 font-semibold text-slate-800">{item.title}</TableCell>
                            <TableCell className="py-4 text-slate-600">{item.subject}</TableCell>
                            <TableCell className="py-4 text-slate-600">{item.dueDate}</TableCell>
                            <TableCell className="py-4">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusDef.color}`}>
                                <StatusIcon className="w-3 h-3 mr-1.5" />
                                {statusDef.label}
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </SoftCard>
        ) : null}

        {showSubmissionsQueue ? (
          <SoftCard title="Submission Verification Queue" subtitle="Approve valid submissions or reject with guidance for rework." theme="white">
            {data.pendingSubmissions.length === 0 ? (
              <div className="py-8 text-center bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
                <p className="text-sm text-slate-500">
                  No pending submissions{liveApi ? "" : " in preview"}.
                </p>
              </div>
            ) : (
              <div className="rounded-[1.5rem] border border-slate-100 overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50/80">
                    <TableRow className="border-b border-slate-100">
                      <TableHead className="py-4 text-slate-600">Assignment</TableHead>
                      <TableHead className="py-4 text-slate-600">Student ID</TableHead>
                      <TableHead className="py-4 text-slate-600">Submission Details</TableHead>
                      <TableHead className="py-4 text-right text-slate-600">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.pendingSubmissions.map((item) => (
                      <TableRow key={item._id} className="border-b border-slate-50 last:border-0">
                        <TableCell className="py-4 font-semibold text-slate-800">
                          {item.assignment_id?.title || "Assignment"}
                        </TableCell>
                        <TableCell className="py-4 text-slate-600">{item.student_auth_id}</TableCell>
                        <TableCell className="py-4 max-w-md">
                          <p className="truncate text-slate-600 bg-slate-50 px-3 py-2 rounded-xl text-sm">
                            {item.submissionText}
                          </p>
                        </TableCell>
                        <TableCell className="py-4 text-right space-x-2">
                          <Button
                            size="sm"
                            disabled={isSaving}
                            className="rounded-full bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-0 shadow-none font-semibold"
                            onClick={() => handleReview(item._id, "approved")}
                          >
                            Verify!
                          </Button>
                          <Button
                            size="sm"
                            disabled={isSaving}
                            className="rounded-full bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 border-0 shadow-none font-semibold"
                            onClick={() => handleReview(item._id, "rejected")}
                          >
                            Reject
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </SoftCard>
        ) : null}

        {showPerformance ? (
          <SoftCard title="Student Performance Overview" subtitle="Academic, wellbeing and reflection logs (Read-only)." theme="white">
            {!overview ? (
              <div className="py-8 text-center bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
                <p className="text-sm text-slate-500">
                  Select a student to load assignments, mood logs and journal entries.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                <div className="rounded-[1.5rem] bg-[#F8FAFC] border border-slate-100 p-5">
                  <p className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-500" /> Recent Assignments
                  </p>
                  <div className="space-y-2">
                    {overview.assignments.slice(0, 5).map((a) => (
                      <div key={a._id} className="bg-white p-3 rounded-xl shadow-sm text-sm border border-slate-50">
                        <p className="font-semibold text-slate-800">{a.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">Due: {a.dueDate}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-[1.5rem] bg-[#FDF2F8] border border-pink-100 p-5">
                  <p className="text-sm font-bold text-pink-900 mb-3 flex items-center gap-2">
                    <HeartPulse className="w-4 h-4 text-pink-500" /> Mood Timeline
                  </p>
                  <div className="space-y-2">
                    {overview.moods.slice(0, 5).map((m) => (
                      <div key={m._id} className="bg-white/60 p-3 rounded-xl shadow-sm text-sm border border-pink-50">
                        <p className="font-semibold text-pink-900 capitalize">{m.mood}</p>
                        <p className="text-xs text-pink-700/70 mt-0.5">{m.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-[1.5rem] bg-[#FEFCE8] border border-yellow-100 p-5">
                  <p className="text-sm font-bold text-yellow-900 mb-3 flex items-center gap-2">
                    <MessageSquareText className="w-4 h-4 text-yellow-500" /> Journal Highlights
                  </p>
                  <div className="space-y-2">
                    {overview.journals.slice(0, 5).map((j) => (
                      <div key={j._id} className="bg-white/60 p-3 rounded-xl shadow-sm text-sm border border-yellow-50">
                        <p className="text-yellow-900 line-clamp-2">"{j.text}"</p>
                        <p className="text-xs text-yellow-700/70 mt-1">
                          {new Date(j.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </SoftCard>
        ) : null}
      </div>
    </main>
  );
}

