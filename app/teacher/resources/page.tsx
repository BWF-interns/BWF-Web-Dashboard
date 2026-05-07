"use client";

import { TeacherDashboardContent } from "../components/TeacherDashboardContent";

export default function TeacherResourcesPage() {
  return (
    <TeacherDashboardContent
      view="resources"
      signInRedirectHref="/auth/login?redirect=/teacher/resources"
    />
  );
}
