export const dynamic = "force-dynamic"; // cách 1: ép Next.js render mỗi request

import PostForm from "../PostForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

async function getPost(id: string) {
  const data = await prisma.blog_posts.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      author: true,
      category: true,
      read_time: true,
      featured: true,
      published: true,
    },
  });
  return data;
}

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
      <PostForm initialData={post} isEdit />
    </div>
  );
}
