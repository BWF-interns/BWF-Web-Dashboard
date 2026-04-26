"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootLandingPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");

    if (token) {
      // Role-based teleportation
      if (role === "admin") {
        router.push("/admin/dashboard");
      } else if (role === "warden") {
        router.push("/warden/dashboard");
      } else {
        // Default to student community for students
        router.push("/student/community");
      }
    } else {
      // No active session? Send to login.
      router.push("/auth/login");
    }
  }, [router]);

  return (
    <div style={{ 
      display: "flex", 
      height: "100vh", 
      justifyContent: "center", 
      alignItems: "center",
      background: "#f8fafc",
      color: "#64748b",
      fontFamily: "Inter, system-ui, sans-serif"
    }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontWeight: 700, marginBottom: "8px" }}>Borderless World Foundation</p>
        <p style={{ fontSize: "0.875rem" }}>Initializing session...</p>
      </div>
    </div>
  );
}
