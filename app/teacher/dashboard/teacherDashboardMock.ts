/**
 * Demo data for Teacher Dashboard (same idea as Warden dashboard mock charts).
 * Shown when there is no API session so the UI stays usable for demos / reviews.
 */
import type {
  AssignmentProgressResponse,
  StudentOverview,
  TeacherDashboardResponse,
} from "../types";

export const MOCK_TEACHER_DASHBOARD: TeacherDashboardResponse = {
  students: [
    { _id: "demo-stu-1", auth_id: "BWF-2024-001", name: "Aisha Khan", class: "7" },
    { _id: "demo-stu-2", auth_id: "BWF-2024-002", name: "Rohan Verma", class: "6" },
    { _id: "demo-stu-3", auth_id: "BWF-2024-003", name: "Priya Singh", class: "8" },
  ],
  resources: [
    { _id: "demo-res-1", key: "library", value: "https://www.borderlessworldfoundation.org/" },
    { _id: "demo-res-2", key: "syllabus", value: "https://www.borderlessworldfoundation.org/" },
    { _id: "demo-res-3", key: "contactMentor", value: "mentor@bwf.example" },
  ],
  pendingSubmissions: [
    {
      _id: "demo-sub-1",
      student_auth_id: "BWF-2024-001",
      submissionText:
        "Completed the English essay draft (approx. 350 words). Attached main ideas on climate awareness.",
      status: "pending",
      rejectionNote: "",
      assignment_id: {
        _id: "demo-asg-1",
        title: "English Essay — Environment",
        subject: "English",
        dueDate: "2026-05-12",
      },
    },
    {
      _id: "demo-sub-2",
      student_auth_id: "BWF-2024-002",
      submissionText: "Science worksheet photos uploaded; labelled diagrams for plant cell.",
      status: "pending",
      rejectionNote: "",
      assignment_id: {
        _id: "demo-asg-2",
        title: "Science — Plant Cell Diagram",
        subject: "Science",
        dueDate: "2026-05-14",
      },
    },
  ],
};

const MOCK_OVERVIEWS: Record<string, StudentOverview> = {
  "BWF-2024-001": {
    student: MOCK_TEACHER_DASHBOARD.students[0],
    assignments: [
      {
        _id: "demo-a1",
        title: "English Essay — Environment",
        subject: "English",
        dueDate: "2026-05-12",
        priority: "high",
      },
      {
        _id: "demo-a2",
        title: "Math Practice Set 4",
        subject: "Mathematics",
        dueDate: "2026-05-15",
        priority: "medium",
      },
    ],
    submissions: [],
    moods: [
      { _id: "demo-m1", mood: "happy", date: "2026-05-05", note: "" },
      { _id: "demo-m2", mood: "okay", date: "2026-05-04", note: "" },
      { _id: "demo-m3", mood: "need_help", date: "2026-05-03", note: "Group work stress" },
    ],
    journals: [
      {
        _id: "demo-j1",
        text: "Today we planned the presentation. I feel more confident after speaking with the mentor.",
        createdAt: "2026-05-05T10:00:00.000Z",
      },
    ],
  },
  "BWF-2024-002": {
    student: MOCK_TEACHER_DASHBOARD.students[1],
    assignments: [
      {
        _id: "demo-b1",
        title: "Science — Plant Cell Diagram",
        subject: "Science",
        dueDate: "2026-05-14",
        priority: "high",
      },
    ],
    submissions: [],
    moods: [{ _id: "demo-m4", mood: "okay", date: "2026-05-05", note: "" }],
    journals: [
      {
        _id: "demo-j2",
        text: "Read chapter 3. Need help with vocabulary list.",
        createdAt: "2026-05-04T15:30:00.000Z",
      },
    ],
  },
  "BWF-2024-003": {
    student: MOCK_TEACHER_DASHBOARD.students[2],
    assignments: [
      {
        _id: "demo-c1",
        title: "Social Studies — Local Governance",
        subject: "Social Studies",
        dueDate: "2026-05-18",
        priority: "low",
      },
    ],
    submissions: [],
    moods: [{ _id: "demo-m5", mood: "happy", date: "2026-05-05", note: "" }],
    journals: [],
  },
};

const MOCK_PROGRESS: Record<string, AssignmentProgressResponse> = {
  "BWF-2024-001": {
    student_auth_id: "BWF-2024-001",
    summary: { total: 3, not_submitted: 1, pending: 1, approved: 1, rejected: 0 },
    assignments: [
      {
        assignment_id: "demo-p1",
        title: "English Essay — Environment",
        subject: "English",
        dueDate: "2026-05-12",
        priority: "high",
        progressStatus: "pending",
        rejectionNote: "",
        submittedAt: "2026-05-06T09:00:00.000Z",
        reviewedAt: null,
      },
      {
        assignment_id: "demo-p2",
        title: "Math Practice Set 4",
        subject: "Mathematics",
        dueDate: "2026-05-15",
        priority: "medium",
        progressStatus: "not_submitted",
        rejectionNote: "",
        submittedAt: null,
        reviewedAt: null,
      },
      {
        assignment_id: "demo-p3",
        title: "Reading Log — Week 18",
        subject: "English",
        dueDate: "2026-05-08",
        priority: "low",
        progressStatus: "approved",
        rejectionNote: "",
        submittedAt: "2026-05-04T11:00:00.000Z",
        reviewedAt: "2026-05-05T14:00:00.000Z",
      },
    ],
  },
  "BWF-2024-002": {
    student_auth_id: "BWF-2024-002",
    summary: { total: 2, not_submitted: 0, pending: 1, approved: 1, rejected: 0 },
    assignments: [
      {
        assignment_id: "demo-p4",
        title: "Science — Plant Cell Diagram",
        subject: "Science",
        dueDate: "2026-05-14",
        priority: "high",
        progressStatus: "pending",
        rejectionNote: "",
        submittedAt: "2026-05-06T08:30:00.000Z",
        reviewedAt: null,
      },
      {
        assignment_id: "demo-p5",
        title: "Mental Math Drill",
        subject: "Mathematics",
        dueDate: "2026-05-10",
        priority: "medium",
        progressStatus: "approved",
        rejectionNote: "",
        submittedAt: "2026-05-03T16:00:00.000Z",
        reviewedAt: "2026-05-04T10:00:00.000Z",
      },
    ],
  },
  "BWF-2024-003": {
    student_auth_id: "BWF-2024-003",
    summary: { total: 1, not_submitted: 1, pending: 0, approved: 0, rejected: 0 },
    assignments: [
      {
        assignment_id: "demo-p6",
        title: "Social Studies — Local Governance",
        subject: "Social Studies",
        dueDate: "2026-05-18",
        priority: "low",
        progressStatus: "not_submitted",
        rejectionNote: "",
        submittedAt: null,
        reviewedAt: null,
      },
    ],
  },
};

export function getMockOverview(studentAuthId: string): StudentOverview {
  return (
    MOCK_OVERVIEWS[studentAuthId] ?? {
      student: null,
      assignments: [],
      submissions: [],
      moods: [],
      journals: [],
    }
  );
}

export function getMockAssignmentProgress(studentAuthId: string): AssignmentProgressResponse {
  return (
    MOCK_PROGRESS[studentAuthId] ?? {
      student_auth_id: studentAuthId,
      summary: { total: 0, not_submitted: 0, pending: 0, approved: 0, rejected: 0 },
      assignments: [],
    }
  );
}

export function mockResourceFormDefaults() {
  return {
    library: MOCK_TEACHER_DASHBOARD.resources.find((r) => r.key === "library")?.value ?? "",
    syllabus: MOCK_TEACHER_DASHBOARD.resources.find((r) => r.key === "syllabus")?.value ?? "",
    contactMentor:
      MOCK_TEACHER_DASHBOARD.resources.find((r) => r.key === "contactMentor")?.value ?? "",
  };
}
