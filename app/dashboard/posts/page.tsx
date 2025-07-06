export const dynamic = "force-dynamic"; // cách 1: ép Next.js render mỗi request

import PostTable from "./PostTable";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

// Data is fetched on the server via Prisma
async function fetchPosts() {
  const data = await prisma.blog_posts.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      author: true,
      published_at: true,
      published: true,
    },
    orderBy: { published_at: "desc" },
  });
  return data;
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
