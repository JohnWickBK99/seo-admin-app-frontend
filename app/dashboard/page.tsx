export const dynamic = "force-dynamic"; // cách 1: ép Next.js render mỗi request

import { prisma } from "@/lib/prisma";
import PostsPerMonthChart from "@/components/PostsPerMonthChart";

export default async function DashboardPage() {
  // Đếm tổng số bài, số đã publish, số draft
  const [total, publishedCount, draftCount] = await Promise.all([
    prisma.blog_posts.count(),
    prisma.blog_posts.count({ where: { published: true } }),
    prisma.blog_posts.count({ where: { published: false } }),
  ]);

  // Thống kê 6 tháng gần nhất
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const recentPosts: { id: string; published_at: Date | null }[] =
    await prisma.blog_posts.findMany({
      where: {
        published: true,
        published_at: { gte: sixMonthsAgo },
      },
      select: { id: true, published_at: true },
    });

  // Tính tổng mỗi tháng
  const monthStatsMap = new Map<string, number>();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    monthStatsMap.set(label, 0);
  }

  recentPosts.forEach((p: { id: string; published_at: Date | null }) => {
    const date = p.published_at ? new Date(p.published_at) : null;
    if (!date) return;
    const label = date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    if (monthStatsMap.has(label)) {
      monthStatsMap.set(label, (monthStatsMap.get(label) || 0) + 1);
    }
  });

  const monthStats = Array.from(monthStatsMap.entries()).map(
    ([month, total]) => ({
      month,
      total,
    })
  );

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg bg-blue-600 text-white p-6">
          <p className="text-sm uppercase">Total Posts</p>
          <p className="text-3xl font-bold">{total ?? "—"}</p>
        </div>
        <div className="rounded-lg bg-green-600 text-white p-6">
          <p className="text-sm uppercase">Published</p>
          <p className="text-3xl font-bold">{publishedCount ?? "—"}</p>
        </div>
        <div className="rounded-lg bg-yellow-500 text-white p-6">
          <p className="text-sm uppercase">Drafts</p>
          <p className="text-3xl font-bold">{draftCount ?? "—"}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-lg">
        <PostsPerMonthChart data={monthStats} />
      </div>
    </div>
  );
}
