export type TeacherProfile = {
  name: string;
  auth_id: string;
  email?: string;
  phone?: string;
  bio?: string;
  profilePic?: string;
  programName?: string;
};

export type StudentLite = {
  _id: string;
  auth_id: string;
  name: string;
  class: string;
};

export type AssignmentSubmission = {
  _id: string;
  student_auth_id: string;
  submissionText: string;
  status: "pending" | "approved" | "rejected";
  rejectionNote: string;
  assignment_id?: {
    _id: string;
    title: string;
    subject: string;
    dueDate: string;
  };
};

export type ResourceKV = {
  _id: string;
  key: "library" | "syllabus" | "contactMentor";
  value: string;
};

export type TeacherDashboardResponse = {
  students: StudentLite[];
  resources: ResourceKV[];
  pendingSubmissions: AssignmentSubmission[];
};

export type StudentOverview = {
  student: StudentLite | null;
  assignments: Array<{
    _id: string;
    title: string;
    subject: string;
    dueDate: string;
    priority: string;
  }>;
  submissions: AssignmentSubmission[];
  moods: Array<{
    _id: string;
    mood: string;
    date: string;
    note: string;
  }>;
  journals: Array<{
    _id: string;
    text: string;
    createdAt: string;
  }>;
};

export type AssignmentProgressResponse = {
  student_auth_id: string;
  summary: {
    total: number;
    not_submitted: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  assignments: Array<{
    assignment_id: string;
    title: string;
    subject: string;
    dueDate: string;
    priority: string;
    progressStatus: "not_submitted" | "pending" | "approved" | "rejected";
    rejectionNote: string;
    submittedAt: string | null;
    reviewedAt: string | null;
  }>;
};
