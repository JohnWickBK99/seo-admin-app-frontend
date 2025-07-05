export const dynamic = "force-dynamic"; // cách 1: ép Next.js render mỗi request

import PostForm from "../PostForm";
import { supabaseServerClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";

async function getPost(id: string) {
  const { data, error } = await supabaseServerClient
    .from("blog_posts")
    .select(
      "id, title, slug, excerpt, content, author, category, read_time, featured, published"
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
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
