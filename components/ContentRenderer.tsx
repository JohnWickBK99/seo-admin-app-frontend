"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import {
  detectContentType,
  detectContentTypeWithConfidence,
} from "@/lib/content-detector";

interface ContentRendererProps {
  content: string;
  className?: string;
  showDebug?: boolean;
  featuredImage?: string | null;
  imageAlt?: string;
}

export function ContentRenderer({
  content,
  className = "",
  showDebug = false,
  featuredImage,
  imageAlt = "Featured image",
}: ContentRendererProps) {
  const detection = detectContentTypeWithConfidence(content);
  const contentType = detectContentType(content);

  // Debug information (only shown in development)
  const debugInfo =
    showDebug && process.env.NODE_ENV === "development" ? (
      <div className="mb-4 p-3 bg-secondary/80 rounded text-xs text-foreground">
        <strong>Content Type Detection:</strong> {contentType} (confidence:{" "}
        {Math.round(detection.confidence * 100)}%)
        <br />
        <strong>Reasons:</strong> {detection.reasons.join(", ")}
      </div>
    ) : null;

  // Render featured image if available
  const featuredImageComponent = featuredImage ? (
    <div className="relative w-full h-[300px] mb-6">
      <Image
        src={featuredImage}
        fill
        alt={imageAlt}
        className="object-cover rounded-md"
      />
    </div>
  ) : null;

  // Render based on content type
  switch (contentType) {
    case "markdown":
      return (
        <div className={className}>
          {debugInfo}
          {featuredImageComponent}
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Custom styling for markdown elements
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold mb-4 text-foreground">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold mb-3 text-foreground">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-bold mb-2 text-foreground">
                  {children}
                </h3>
              ),
              h4: ({ children }) => (
                <h4 className="text-lg font-bold mb-2 text-foreground">
                  {children}
                </h4>
              ),
              h5: ({ children }) => (
                <h5 className="text-base font-bold mb-2 text-foreground">
                  {children}
                </h5>
              ),
              h6: ({ children }) => (
                <h6 className="text-sm font-bold mb-2 text-foreground">
                  {children}
                </h6>
              ),
              p: ({ children }) => (
                <p className="mb-4 leading-relaxed text-foreground">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-4 space-y-1 text-foreground">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-4 space-y-1 text-foreground">
                  {children}
                </ol>
              ),
              li: ({ children }) => <li className="mb-1">{children}</li>,
              code: ({ children, className }) => {
                const isInline = !className;
                return isInline ? (
                  <code className="bg-muted px-2 py-1 rounded text-sm font-mono text-primary">
                    {children}
                  </code>
                ) : (
                  <code
                    className={`${className} bg-muted px-2 py-1 rounded text-sm font-mono text-primary`}
                  >
                    {children}
                  </code>
                );
              },
              pre: ({ children }) => (
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4 font-mono text-sm text-foreground">
                  {children}
                </pre>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary pl-4 italic mb-4 text-foreground bg-secondary/40 py-2">
                  {children}
                </blockquote>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-primary hover:text-primary/80 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              strong: ({ children }) => (
                <strong className="font-bold text-foreground">
                  {children}
                </strong>
              ),
              em: ({ children }) => (
                <em className="italic text-foreground">{children}</em>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full border border-border">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="border border-border px-4 py-2 bg-muted font-bold text-left text-foreground">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-border px-4 py-2 text-foreground">
                  {children}
                </td>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      );

    case "html":
      return (
        <div className={className}>
          {debugInfo}
          {featuredImageComponent}
          <div
            className="prose prose-lg max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      );

    case "plain":
    default:
      return (
        <div className={className}>
          {debugInfo}
          {featuredImageComponent}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="whitespace-pre-wrap text-foreground">{content}</p>
          </div>
        </div>
      );
  }
} 