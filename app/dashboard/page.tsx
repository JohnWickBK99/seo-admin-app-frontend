export const dynamic = "force-dynamic"; // cách 1: ép Next.js render mỗi request

import { prisma } from "@/lib/prisma";
import PostsPerMonthChart from "@/components/PostsPerMonthChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total ?? "—"}</div>
            <p className="text-xs text-muted-foreground">
              All posts in the database
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedCount ?? "—"}</div>
            <p className="text-xs text-muted-foreground">
              Posts visible to readers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftCount ?? "—"}</div>
            <p className="text-xs text-muted-foreground">Unpublished posts</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Posts Per Month</CardTitle>
          <CardDescription>
            Number of posts published in the last 6 months
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[300px]">
            <PostsPerMonthChart data={monthStats} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
