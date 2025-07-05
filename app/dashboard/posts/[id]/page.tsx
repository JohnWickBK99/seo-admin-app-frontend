import PostForm from "../PostForm";
import { notFound } from "next/navigation";

async function getPost(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/blog/${id}`,
    {
      cache: "no-store",
    }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export default async function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  const post = await getPost(params.id);
  if (!post) notFound();

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
      <PostForm initialData={post} isEdit />
    </div>
  );
}
