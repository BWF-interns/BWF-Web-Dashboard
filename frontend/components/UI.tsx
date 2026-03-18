"use client";

// StatusBadge
const badgeMap: Record<string, string> = {
  PENDING: "badge-pending",
  APPROVED: "badge-approved",
  REJECTED: "badge-rejected",
  OPEN: "badge-open",
  RESOLVED: "badge-resolved",
  ESCALATED: "badge-escalated",
};

export function StatusBadge({ status }: { status: string }) {
  return <span className={badgeMap[status] || "badge-pending"}>{status}</span>;
}

// Pagination
export function Pagination({
  page, pages, onPageChange,
}: { page: number; pages: number; onPageChange: (p: number) => void }) {
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button onClick={() => onPageChange(page - 1)} disabled={page === 1} className="btn-secondary px-3 py-1 text-sm disabled:opacity-40">
        Previous
      </button>
      <span className="text-sm text-gray-600">Page {page} of {pages}</span>
      <button onClick={() => onPageChange(page + 1)} disabled={page === pages} className="btn-secondary px-3 py-1 text-sm disabled:opacity-40">
        Next
      </button>
    </div>
  );
}
