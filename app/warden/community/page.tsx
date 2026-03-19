"use client";

import { useState } from "react";
import { Heart, MessageCircle, Send } from "lucide-react";

interface Post {
  author: string;
  content: string;
  time: string;
  likes: number;
  comments: number;
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([
    {
      author: "Arjun Kumar",
      content: "Had a great study session today with friends 📚",
      time: "2 hours ago",
      likes: 5,
      comments: 2,
    },
    {
      author: "Meera Patel",
      content: "Thank you for providing new books! 🙏",
      time: "5 hours ago",
      likes: 8,
      comments: 3,
    },
  ]);

  const [newPost, setNewPost] = useState("");

  const addPost = () => {
    if (!newPost.trim()) return;

    setPosts([
      {
        author: "You",
        content: newPost,
        time: "Just now",
        likes: 0,
        comments: 0,
      },
      ...posts,
    ]);

    setNewPost("");
  };

  const likePost = (index: number) => {
    const updated = [...posts];
    updated[index].likes += 1;
    setPosts(updated);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Community
        </h1>
        <p className="text-sm text-gray-500">
          Connect and engage with students
        </p>
      </div>

      {/* Create Post */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-sm text-black">
        <textarea
          placeholder="Write something..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
        />

        <div className="flex justify-end">
          <button
            onClick={addPost}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
          >
            <Send size={16} />
            Post
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {posts.map((post, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-sm hover:shadow-md transition"
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <p className="font-medium text-gray-900">
                {post.author}
              </p>
              <span className="text-xs text-gray-400">
                {post.time}
              </span>
            </div>

            {/* Content */}
            <p className="text-sm text-gray-800">
              {post.content}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <button
                onClick={() => likePost(i)}
                className="flex items-center gap-1 hover:text-red-500"
              >
                <Heart size={16} />
                {post.likes}
              </button>

              <div className="flex items-center gap-1">
                <MessageCircle size={16} />
                {post.comments}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}