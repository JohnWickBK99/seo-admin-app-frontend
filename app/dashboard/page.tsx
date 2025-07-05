import { supabaseServerClient } from "@/lib/supabase-server";

export default async function DashboardPage() {
  // Lấy tổng số bài post
  const { count } = await supabaseServerClient
    .from("blog_posts")
    .select("*", { count: "exact", head: true });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg bg-blue-600 text-white p-6">
          <p className="text-sm uppercase">Posts</p>
          <p className="text-3xl font-bold">{count ?? "—"}</p>
        </div>
      </div>
    </div>
  );
}
