"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface UrlContentImportProps {
  onContentGenerated: (content: {
    title: string;
    content: string;
    excerpt?: string;
    author?: string;
    category?: string;
    read_time?: string;
    word_count?: number;
    image_url?: string;
  }) => void;
}

export function UrlContentImport({
  onContentGenerated,
}: UrlContentImportProps) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setError(null);
  };

  const processUrl = async () => {
    if (!url.trim()) {
      setError("Vui lòng nhập URL");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Gọi API scrape để lấy HTML từ URL
      const scrapeResponse = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const { result } = await scrapeResponse.json();

      if (!scrapeResponse.ok || result?.error) {
        // Gọi API generate để tạo nội dung blog từ HTML
        const firecrawlResponse = await fetch("/api/firecrawl", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        });
        if (!firecrawlResponse.ok) {
          const error = await firecrawlResponse.json();
          throw new Error(error.message || "Lỗi khi lấy nội dung từ URL");
        }
        const content = await firecrawlResponse.json();
        onContentGenerated(content);
        return;
        // const error = await scrapeResponse.json();
        // throw new Error(error.message || "Lỗi khi lấy nội dung từ URL");
      }

      // Gọi API generate để tạo nội dung blog từ HTML
      const generateResponse = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...result, url }),
      });

      if (!generateResponse.ok) {
        const error = await generateResponse.json();
        throw new Error(error.message || "Lỗi khi tạo nội dung blog");
      }

      // Nhận kết quả và truyền lại cho component cha
      const content = await generateResponse.json();
      onContentGenerated(content);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("Form submit triggered");
    e.preventDefault();
    await processUrl();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="blog-url">URL bài báo hoặc blog</Label>
        <div className="flex space-x-2">
          <Input
            id="blog-url"
            placeholder="https://example.com/article"
            value={url}
            onChange={handleUrlChange}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            type="button"
            disabled={isLoading || !url.trim()}
            onClick={processUrl}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý
              </>
            ) : (
              "Tạo nội dung"
            )}
          </Button>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </form>
  );
}
