export const dynamic = "force-dynamic"; // cách 1: ép Next.js render mỗi request

import PostTable from "./PostTable";
import Link from "next/link";
import { supabaseServerClient } from "@/lib/supabase-server";

// Data is fetched on the server via Supabase instead of hitting our internal API
async function fetchPosts() {
  const { data, error } = await supabaseServerClient
    .from("blog_posts")
    .select("id, title, slug, author, published_at, published")
    .order("published_at", { ascending: false });

  if (error) throw new Error(error.message);
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
