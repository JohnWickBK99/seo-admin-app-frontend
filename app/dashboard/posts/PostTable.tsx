"use client";

import { useState } from "react";

interface Post {
  id: string;
  title: string;
  slug: string;
  author: string;
  published_at: string | null;
  published: boolean;
}

export default function PostTable({ posts }: { posts: Post[] }) {
  const [data, setData] = useState(posts);

  const handleDelete = async (id: string) => {
    const ok = confirm("Are you sure you want to delete this post?");
    if (!ok) return;
    const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
    if (res.ok) {
      setData((prev) => prev.filter((p) => p.id !== id));
    } else {
      const { message } = await res.json();
      alert(message ?? "Failed to delete");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm backdrop-blur-lg bg-white/5 border border-white/10 rounded-lg overflow-hidden">
        <thead className="bg-white/10 text-gray-300">
          <tr>
            <th className="px-4 py-2 text-left">Title</th>
            <th className="px-4 py-2 text-left">Author</th>
            <th className="px-4 py-2">Published</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((post) => (
            <tr
              key={post.id}
              className="odd:bg-white/5 even:bg-white/10 hover:bg-white/20 transition"
            >
              <td className="px-4 py-2 whitespace-nowrap">{post.title}</td>
              <td className="px-4 py-2 whitespace-nowrap">{post.author}</td>
              <td className="px-4 py-2 text-center">
                {post.published ? "✔️" : "❌"}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                {post.published_at
                  ? new Date(post.published_at).toLocaleDateString()
                  : "—"}
              </td>
              <td className="px-4 py-2 space-x-2 text-center">
                <a
                  href={`/dashboard/posts/${post.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </a>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
