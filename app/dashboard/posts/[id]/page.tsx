"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ContentRenderer } from "@/components/ContentRenderer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  author: string;
  category?: string;
  read_time?: string;
  featured?: boolean;
  published?: boolean;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
  image_url?: string;
  image_alt?: string;
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const id = params.id as string;

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/blogs/${id}`);
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        const data = await res.json();
        setPost(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchPost();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      router.push("/dashboard/posts");
    } catch (err) {
      alert(err instanceof Error ? err.message : "An error occurred");
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-6">Loading post details...</div>;
  }

  if (error || !post) {
    return (
      <div className="p-6 text-red-500">Error: {error || "Post not found"}</div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <div className="space-x-2">
          <Button
            onClick={() => router.push(`/dashboard/posts/${post.id}/edit`)}
          >
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <ContentRenderer
              content={post.content}
              showDebug={false}
              featuredImage={post.image_url}
              imageAlt={post.image_alt || post.title}
            />
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="font-bold text-xl mb-4">Post Info</h2>
            <dl className="space-y-2">
              <div className="grid grid-cols-3">
                <dt className="font-medium">Status:</dt>
                <dd className="col-span-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${post.published ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300" : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300"}`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>
                </dd>
              </div>

              <div className="grid grid-cols-3">
                <dt className="font-medium">Featured:</dt>
                <dd className="col-span-2">{post.featured ? "Yes" : "No"}</dd>
              </div>

              <div className="grid grid-cols-3">
                <dt className="font-medium">Author:</dt>
                <dd className="col-span-2">{post.author}</dd>
              </div>

              {post.category && (
                <div className="grid grid-cols-3">
                  <dt className="font-medium">Category:</dt>
                  <dd className="col-span-2">{post.category}</dd>
                </div>
              )}

              {post.read_time && (
                <div className="grid grid-cols-3">
                  <dt className="font-medium">Read Time:</dt>
                  <dd className="col-span-2">{post.read_time}</dd>
                </div>
              )}

              <div className="grid grid-cols-3">
                <dt className="font-medium">Slug:</dt>
                <dd className="col-span-2 text-sm truncate">{post.slug}</dd>
              </div>

              {post.published_at && (
                <div className="grid grid-cols-3">
                  <dt className="font-medium">Published:</dt>
                  <dd className="col-span-2">
                    {new Date(post.published_at).toLocaleString()}
                  </dd>
                </div>
              )}

              <div className="grid grid-cols-3">
                <dt className="font-medium">Created:</dt>
                <dd className="col-span-2">
                  {post.created_at &&
                    new Date(post.created_at).toLocaleString()}
                </dd>
              </div>

              <div className="grid grid-cols-3">
                <dt className="font-medium">Updated:</dt>
                <dd className="col-span-2">
                  {post.updated_at &&
                    new Date(post.updated_at).toLocaleString()}
                </dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}
