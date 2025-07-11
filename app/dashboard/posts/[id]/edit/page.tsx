export const dynamic = "force-dynamic"; // cách 1: ép Next.js render mỗi request

import PostForm from "../../PostForm";
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
      image_url: true, 
      image_alt: true,
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
      <PostForm
        initialData={{
          ...post,
          featured: post.featured ?? undefined,
          published: post.published ?? undefined,
          excerpt: post.excerpt ?? undefined,
          read_time: post.read_time ?? undefined,
          category: post.category ?? undefined,
          image_url: post.image_url ?? undefined,
          image_alt: post.image_alt ?? undefined,
        }}
        isEdit
      />
    </div>
  );
} 