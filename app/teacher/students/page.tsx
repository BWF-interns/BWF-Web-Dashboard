"use client";

import { TeacherDashboardContent } from "../components/TeacherDashboardContent";

export default function TeacherStudentsPage() {
  return (
    <TeacherDashboardContent
      view="students"
      signInRedirectHref="/auth/login?redirect=/teacher/students"
    />
  );
}
