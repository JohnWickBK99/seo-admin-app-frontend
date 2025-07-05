import PostTable from "./PostTable";
import Link from "next/link";

async function fetchPosts() {
  const base =
    process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
  const res = await fetch(`${base}/api/blogs`, {
    // Luôn lấy dữ liệu mới nhất
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export default async function PostsPage() {
  const posts = await fetchPosts();

  return (
    <div className="space-y-6 backdrop-blur-lg bg-white/5 p-8 rounded-xl border border-white/10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Posts</h1>
        <Link
          href="/dashboard/posts/new"
          className="px-4 py-2 rounded-lg bg-blue-600/20 backdrop-blur-md border border-blue-500/30 text-blue-100 hover:bg-blue-600/30 transition"
        >
          New Post
        </Link>
      </div>
      <PostTable posts={posts} />
    </div>
  );
}
