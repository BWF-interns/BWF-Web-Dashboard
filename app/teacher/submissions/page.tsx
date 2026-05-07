"use client";

import { TeacherDashboardContent } from "../components/TeacherDashboardContent";

export default function TeacherSubmissionsPage() {
  return (
    <TeacherDashboardContent
      view="submissions"
      signInRedirectHref="/auth/login?redirect=/teacher/submissions"
    />
  );
}
