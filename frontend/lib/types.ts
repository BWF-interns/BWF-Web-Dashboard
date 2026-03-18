export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Student {
  _id: string;
  name: string;
  age: number;
  education: string;
  interests: string[];
  address: string;
  guardian_info: { name: string; phone: string; relation: string };
  assigned_warden_id: string;
  is_active: boolean;
  createdAt: string;
}

export interface Activity {
  _id: string;
  student_id: { _id: string; name: string } | string;
  type: string;
  hours: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  comments: string;
  createdAt: string;
}

export interface Expense {
  _id: string;
  student_id: { _id: string; name: string } | string;
  category: "Food" | "Medical" | "Education" | "Misc";
  amount: number;
  description: string;
  date: string;
  createdAt: string;
}

export interface Post {
  _id: string;
  student_id: { _id: string; name: string } | string;
  content: string;
  image_url: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

export interface Complaint {
  _id: string;
  student_id: { _id: string; name: string } | string;
  message: string;
  status: "OPEN" | "RESOLVED" | "ESCALATED";
  is_anonymous: boolean;
  createdAt: string;
}

export interface DashboardSummary {
  totalStudents: number;
  pendingActivities: number;
  pendingPosts: number;
  monthlyExpenses: number;
  openComplaints: number;
  inactiveStudents: number;
}

export interface FeedItem {
  type: string;
  message: string;
  status?: string;
  time: string;
}
