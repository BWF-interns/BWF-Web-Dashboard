"use client";
import { useState } from "react";
import useSWR from "swr";
import api from "@/lib/api";
import { Post } from "@/lib/types";
import { Pagination } from "@/components/UI";
import toast from "react-hot-toast";
import { CheckCircle, XCircle, ImageIcon, AlertCircle } from "lucide-react";

const fetcher = (url: string) => api.get(url).then((r) => r.data);

export default function CommunityPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, mutate } = useSWR(`/warden/posts/pending?page=${page}&limit=12`, fetcher);
  const posts: Post[] = data?.posts || [];

  const handleAction = async (id: string, action: "approve" | "reject") => {
    try {
      await api.put(`/warden/posts/${id}/${action}`);
      toast.success(`Post ${action}d`);
      mutate();
    } catch {
      toast.error("Action failed");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Community Moderation</h1>
        <p className="text-gray-500 mt-1">{data?.total ?? 0} posts pending review</p>
      </div>

      {error ? (
        <div className="card flex items-center gap-3 text-red-600 bg-red-50 border-red-200">
          <AlertCircle size={18} />
          <p className="text-sm">Failed to load posts. Please refresh the page.</p>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>
      ) : posts.length === 0 ? (
        <div className="card text-center py-16">
          <CheckCircle className="mx-auto text-green-400 mb-3" size={40} />
          <p className="text-gray-500">All caught up! No pending posts.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((post) => {
            const studentName = typeof post.student_id === "object" ? post.student_id.name : "Unknown";
            return (
              <div key={post._id} className="card space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{studentName}</p>
                    <p className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleString()}</p>
                  </div>
                  <span className="badge-pending">Pending</span>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed">{post.content}</p>

                {post.image_url && (
                  <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                    <ImageIcon size={14} />
                    <span>Image attached</span>
                  </div>
                )}

                <div className="flex gap-3 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleAction(post._id, "approve")}
                    className="btn-success flex-1 flex items-center justify-center gap-2 py-2.5"
                  >
                    <CheckCircle size={16} /> Approve
                  </button>
                  <button
                    onClick={() => handleAction(post._id, "reject")}
                    className="btn-danger flex-1 flex items-center justify-center gap-2 py-2.5"
                  >
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Pagination page={page} pages={data?.pages || 1} onPageChange={setPage} />
    </div>
  );
}
