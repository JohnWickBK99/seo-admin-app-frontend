"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ContentRenderer } from "@/components/ContentRenderer";

// Import shadcn-ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Define schema
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

type PostFormValues = z.infer<typeof PostSchema>;

interface PostFormProps {
  initialData?: Partial<PostFormValues> & { id?: string };
  isEdit?: boolean;
}

export default function PostForm({
  initialData,
  isEdit = false,
}: PostFormProps) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [featuredChecked, setFeaturedChecked] = useState<boolean>(
    initialData?.featured ?? false
  );
  const [publishedChecked, setPublishedChecked] = useState<boolean>(
    initialData?.published ?? true
  );

  // Create form with type assertion to avoid complex type issues
  const form = useForm({
    resolver: zodResolver(PostSchema) as any,
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      excerpt: initialData?.excerpt || "",
      content: initialData?.content || "",
      author: initialData?.author || "",
      category: initialData?.category || "",
      read_time: initialData?.read_time || "",
      featured: initialData?.featured ?? false,
      published: initialData?.published ?? true,
    },
  });

  // Extract form methods
  const { register, handleSubmit, formState, watch, setValue } = form;
  const { errors, isSubmitting } = formState;

  // Watch values for preview and slug generation
  const titleValue = watch("title");
  const slugValue = watch("slug");
  const contentValue = watch("content");

  // Slugify function
  function slugify(str: string) {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  // Auto-generate slug from title
  useEffect(() => {
    const auto = slugify(titleValue);
    if (!slugValue || slugValue === auto) {
      setValue("slug", auto);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titleValue]);

  // Form submission handler
  const onSubmit = async (data: any) => {
    try {
      setErrorMessage(null);
      const endpoint = isEdit ? `/api/blogs/${initialData?.id}` : "/api/blogs";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          featured: featuredChecked,
          published: publishedChecked,
        }),
      });

      if (!res.ok) {
        const responseData = await res.json();
        setErrorMessage(responseData.message ?? "Something went wrong");
        return;
      }

      // Navigate back to posts list on success
      router.push("/dashboard/posts");
    } catch (error) {
      setErrorMessage("An unexpected error occurred");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register("title")} />
        {errors.title && (
          <p className="text-sm text-destructive">
            {errors.title?.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" {...register("slug")} />
        {errors.slug && (
          <p className="text-sm text-destructive">
            {errors.slug?.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea id="excerpt" rows={3} {...register("excerpt")} />
        {errors.excerpt && (
          <p className="text-sm text-destructive">
            {errors.excerpt?.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="grid grid-cols-2 mb-2">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="edit">
            <Textarea id="content" rows={15} {...register("content")} />
          </TabsContent>
          <TabsContent value="preview">
            <Card>
              <CardContent className="p-4">
                {contentValue ? (
                  <ContentRenderer content={contentValue} showDebug={true} />
                ) : (
                  <p className="text-muted-foreground italic">
                    No content to preview
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        {errors.content && (
          <p className="text-sm text-destructive">
            {errors.content?.message as string}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input id="author" {...register("author")} />
          {errors.author && (
            <p className="text-sm text-destructive">
              {errors.author?.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" {...register("category")} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="read_time">Read Time</Label>
          <Input id="read_time" {...register("read_time")} />
        </div>

        <div className="flex items-center space-x-6 pt-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={featuredChecked}
              onCheckedChange={(checked) => {
                setFeaturedChecked(checked === true);
                setValue("featured", checked === true);
              }}
            />
            <Label htmlFor="featured" className="cursor-pointer">
              Featured
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="published"
              checked={publishedChecked}
              onCheckedChange={(checked) => {
                setPublishedChecked(checked === true);
                setValue("published", checked === true);
              }}
            />
            <Label htmlFor="published" className="cursor-pointer">
              Published
            </Label>
          </div>
        </div>
      </div>

      {errorMessage && (
        <p className="text-center text-destructive text-sm">{errorMessage}</p>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : isEdit ? "Update Post" : "Create Post"}
      </Button>
    </form>
  );
}

