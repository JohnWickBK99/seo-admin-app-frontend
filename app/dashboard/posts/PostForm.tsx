"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ContentRenderer } from "@/components/ContentRenderer";
import { ImageUpload } from "@/components/ui/image-upload";
import { UrlContentImport } from "@/components/ui/url-content-import";

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
  image_url: z.string().optional().nullable(),
  image_alt: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
});

// Log schema cho debug
console.log("Post Schema initialized");

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
  const [showUrlImport, setShowUrlImport] = useState<boolean>(false);

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
      image_url: initialData?.image_url || null,
      image_alt: initialData?.image_alt || "",
      featured: initialData?.featured ?? false,
      published: initialData?.published ?? true,
    },
  });

  // Extract form methods
  const { register, handleSubmit, formState, watch, setValue } = form;
  const { errors, isSubmitting } = formState;

  // Log validation errors để debug
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Form validation errors:", errors);
    }
  }, [errors]);

  // Watch values for preview and slug generation
  const titleValue = watch("title");
  const slugValue = watch("slug");
  const contentValue = watch("content");
  const imageUrlValue = watch("image_url");

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
      console.log("Form submitted", data); // Thêm logging để debug
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
        const errorMsg = responseData.message ?? "Something went wrong";
        console.error("API Error:", errorMsg);
        setErrorMessage(errorMsg);
        return;
      }

      console.log("Form submitted successfully");
      // Navigate back to posts list on success
      router.push("/dashboard/posts");
    } catch (error) {
      console.error("Submit error:", error);
      setErrorMessage("An unexpected error occurred");
    }
  };

  // Xử lý khi nội dung được tạo từ URL
  const handleContentGenerated = (content: {
    title: string;
    content: string;
    excerpt?: string;
    author?: string;
    category?: string;
    read_time?: string;
    word_count?: number;
    image_url?: string;
  }) => {
    // Điền các trường từ nội dung được tạo
    setValue("title", content.title);
    setValue("content", content.content);

    if (content.excerpt) {
      setValue("excerpt", content.excerpt);
    }

    if (content.author) {
      setValue("author", content.author);
    }

    if (content.category) {
      setValue("category", content.category);
    }

    if (content.read_time) {
      setValue("read_time", content.read_time);
    }

    if (content.image_url) {
      setValue("image_url", content.image_url);
    }

    // Ẩn form nhập URL sau khi nội dung được tạo
    setShowUrlImport(false);
  };

  return (
    <form
      onSubmit={(e) => {
        console.log("Form onSubmit event fired");
        handleSubmit(onSubmit)(e);
      }}
      className="space-y-6"
    >
      {!isEdit && (
        <div className="space-y-4 border rounded-md p-4 bg-muted/20">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Tạo nội dung tự động</h2>
            <Button
              type="button"
              variant={showUrlImport ? "default" : "outline"}
              onClick={() => setShowUrlImport(!showUrlImport)}
            >
              {showUrlImport ? "Ẩn" : "Tạo từ URL"}
            </Button>
          </div>

          {showUrlImport && (
            <UrlContentImport onContentGenerated={handleContentGenerated} />
          )}
        </div>
      )}

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
        <Label>Featured Image</Label>
        <ImageUpload
          value={imageUrlValue}
          onChange={(url) => setValue("image_url", url)}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image_alt">Image Alt Text</Label>
        <Input id="image_alt" {...register("image_alt")} />
        <p className="text-xs text-muted-foreground">
          Mô tả ngắn về ảnh để tối ưu SEO
        </p>
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
                  <ContentRenderer
                    content={contentValue}
                    showDebug={true}
                    featuredImage={imageUrlValue}
                  />
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

      <Button
        type="submit"
        disabled={isSubmitting}
        onClick={() => console.log("Submit button clicked")}
        className="z-50 relative"
      >
        {isSubmitting ? "Saving..." : isEdit ? "Update Post" : "Create Post"}
      </Button>
    </form>
  );
}

