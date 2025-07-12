"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string) => void;
  className?: string;
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  className,
  disabled = false,
}: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file
      if (!file.type.startsWith("image/")) {
        setError("Chỉ chấp nhận file ảnh");
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("File ảnh phải nhỏ hơn 5MB");
        return;
      }

      // Reset error
      setError(null);
      setIsLoading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Lỗi khi upload ảnh");
        }

        // Set the image URL
        onChange(data.url);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Lỗi khi upload ảnh");
        console.error("Upload error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        onClick={!disabled && !isLoading ? handleClick : undefined}
        className={cn(
          "relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-accent/50 transition",
          value ? "h-64" : "h-40",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled || isLoading}
        />

        {value ? (
          <div className="relative w-full h-full">
            <Image
              fill
              src={value}
              alt="Uploaded image"
              className="object-contain"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="text-4xl">🖼️</div>
            <p className="text-sm text-muted-foreground text-center">
              Kéo thả hoặc click để upload ảnh
            </p>
            <p className="text-xs text-muted-foreground">
              Tối đa 5MB, JPG, PNG, GIF
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}

      {value && !disabled && (
        <Button
          variant="outline"
          size="sm"
          type="button"
          disabled={isLoading}
          className="mt-2 w-full"
          onClick={handleClick}
        >
          Thay đổi ảnh
        </Button>
      )}
    </div>
  );
} 