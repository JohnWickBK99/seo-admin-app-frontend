"use client";

import { useForm, Resolver, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ContentRenderer } from "@/components/ContentRenderer";

const PostSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  slug: z.string().min(1, { message: "Slug is required" }),
  excerpt: z.string().optional(),
  content: z.string().min(1, { message: "Content is required" }),
  author: z.string().min(1, { message: "Author is required" }),
  category: z.string().optional(),
  read_time: z.string().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
});

type PostValues = z.infer<typeof PostSchema>;

export default function PostForm({
  initialData,
  isEdit = false,
}: {
  initialData?: Partial<PostValues> & { id?: string };
  isEdit?: boolean;
}) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [contentView, setContentView] = useState<"edit" | "preview">("edit");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<PostValues>({
    resolver: zodResolver(PostSchema) as Resolver<PostValues>,
    defaultValues: initialData ?? {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      author: "",
      category: "",
      read_time: "",
      featured: false,
      published: true,
    },
  });

  const titleValue = watch("title");
  const slugValue = watch("slug");
  const contentValue = watch("content");

  function slugify(str: string) {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  // Sync slug in effect to tránh loop setValue trong render
  useEffect(() => {
    const auto = slugify(titleValue);
    if (!slugValue || slugValue === auto) {
      setValue("slug", auto);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titleValue]);

  const onSubmit: SubmitHandler<PostValues> = async (values) => {
    setErrorMessage(null);
    const endpoint = isEdit ? `/api/blogs/${initialData?.id}` : "/api/blogs";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const { message } = await res.json();
      setErrorMessage(message ?? "Something went wrong");
      return;
    }

    // thành công → quay lại danh sách
    router.push("/dashboard/posts");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          className="w-full rounded border px-3 py-2"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Slug</label>
        <input
          className="w-full rounded border px-3 py-2"
          {...register("slug")}
        />
        {errors.slug && (
          <p className="text-sm text-red-600">{errors.slug.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Excerpt</label>
        <textarea
          rows={3}
          className="w-full rounded border px-3 py-2"
          {...register("excerpt")}
        />
        {errors.excerpt && (
          <p className="text-sm text-red-600">{errors.excerpt.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Content</label>

        {/* Tabs để chọn chế độ xem */}
        <div className="flex mb-2 border-b">
          <button
            type="button"
            onClick={() => setContentView("edit")}
            className={`px-4 py-2 ${
              contentView === "edit"
                ? "text-blue-600 border-b-2 border-blue-600 font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Chỉnh sửa
          </button>
          <button
            type="button"
            onClick={() => setContentView("preview")}
            className={`px-4 py-2 ${
              contentView === "preview"
                ? "text-blue-600 border-b-2 border-blue-600 font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Xem trước
          </button>
        </div>

        {/* Hiển thị content dựa trên chế độ xem */}
        {contentView === "edit" ? (
          <textarea
            rows={6}
            className="w-full rounded border px-3 py-2"
            {...register("content")}
          />
        ) : (
          <div className="border rounded p-4 min-h-[200px] bg-white">
            {contentValue ? (
              <ContentRenderer content={contentValue} showDebug={true} />
            ) : (
              <p className="text-gray-500 italic">
                Chưa có nội dung để xem trước
              </p>
            )}
          </div>
        )}

        {errors.content && (
          <p className="text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Author</label>
          <input
            className="w-full rounded border px-3 py-2"
            {...register("author")}
          />
          {errors.author && (
            <p className="text-sm text-red-600">{errors.author.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <input
            className="w-full rounded border px-3 py-2"
            {...register("category")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Read Time</label>
          <input
            className="w-full rounded border px-3 py-2"
            {...register("read_time")}
          />
        </div>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input type="checkbox" {...register("featured")} />
            <span>Featured</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" {...register("published")} />
            <span>Published</span>
          </label>
        </div>
      </div>

      {errorMessage && (
        <p className="text-center text-red-600 text-sm">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : isEdit ? "Update Post" : "Create Post"}
      </button>
    </form>
  );
}
