"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Post {
  id: string;
  title: string;
  slug: string;
  author: string;
  published_at: string | null;
  published: boolean;
}

export default function PostTable({ posts }: { posts: Post[] }) {
  const [data, setData] = useState(posts);

  const handleDelete = async (id: string) => {
    const ok = confirm("Are you sure you want to delete this post?");
    if (!ok) return;
    const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
    if (res.ok) {
      setData((prev) => prev.filter((p) => p.id !== id));
    } else {
      const { message } = await res.json();
      alert(message ?? "Failed to delete");
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Author</TableHead>
          <TableHead className="text-center">Published</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((post) => (
          <TableRow key={post.id}>
            <TableCell className="font-medium">{post.title}</TableCell>
            <TableCell>{post.author}</TableCell>
            <TableCell className="text-center">
              {post.published ? "✔️" : "❌"}
            </TableCell>
            <TableCell>
              {post.published_at
                ? new Date(post.published_at).toLocaleDateString()
                : "—"}
            </TableCell>
            <TableCell className="flex justify-center space-x-2">
              <Button variant="outline" size="sm" asChild>
                <a href={`/dashboard/posts/${post.id}`}>Edit</a>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(post.id)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
