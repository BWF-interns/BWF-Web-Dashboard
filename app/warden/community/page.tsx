/**
 * Community Moderation page — shows pending student posts.
 * Warden can approve or reject each post.
 */
"use client";
import { useEffect, useState, useCallback } from "react";

interface Post {
  _id: string;
  student_id: { _id: string; name: string } | string;
  content: string; image_url: string | null; createdAt: string;
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPosts = useCallback(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/warden/posts/pending?page=${page}&limit=12`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => { setPosts(data.posts || []); setTotal(data.total || 0); setPages(data.pages || 1); })
      .catch(() => setError("Failed to load posts."))
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    const token = localStorage.getItem("token");
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/warden/posts/${id}/${action}`, {
      method: "PUT", headers: { Authorization: `Bearer ${token}` },
    });
    fetchPosts();
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Community Moderation</h1>
        <p className="text-gray-500 mt-1">{total} posts pending review</p>
      </div>

      {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>
      ) : posts.length === 0 ? (
        <div className="border rounded-lg p-16 text-center text-gray-500">All caught up! No pending posts.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((post) => {
            const name = typeof post.student_id === "object" ? post.student_id.name : "Unknown";
            return (
              <div key={post._id} className="border rounded-lg p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{name}</p>
                    <p className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleString()}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">Pending</span>
                </div>
                <p className="text-sm text-gray-700">{post.content}</p>
                {post.image_url && (
                  <p className="text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">Image attached</p>
                )}
                <div className="flex gap-3 pt-2 border-t">
                  <button onClick={() => handleAction(post._id, "approve")} className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">Approve</button>
                  <button onClick={() => handleAction(post._id, "reject")} className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">Reject</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {pages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => setPage(page - 1)} disabled={page === 1} className="px-3 py-1 border rounded text-sm disabled:opacity-40">Previous</button>
          <span className="text-sm text-gray-600">Page {page} 
of {pages}</span>
          <button onClick={() => setPage(page + 1)} disabled={page === pages} className="px-3 py-1 border rounded text-sm disabled:opacity-40">Next</button>
        </div>
      )}
    </div>
  );
}
