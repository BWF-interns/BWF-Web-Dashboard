import ComplaintsPage from "./ComplaintPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complaints",
  description: "Submit and track your complaints.",
};

export default function ServerProfilePage() {
  return <ComplaintsPage />;
}
