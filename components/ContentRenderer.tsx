"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  detectContentType,
  detectContentTypeWithConfidence,
} from "@/lib/content-detector";

interface ContentRendererProps {
  content: string;
  className?: string;
  showDebug?: boolean;
}

export function ContentRenderer({
  content,
  className = "",
  showDebug = false,
}: ContentRendererProps) {
  const detection = detectContentTypeWithConfidence(content);
  const contentType = detectContentType(content);

  // Debug information (only shown in development)
  const debugInfo =
    showDebug && process.env.NODE_ENV === "development" ? (
      <div className="mb-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
        <strong>Content Type Detection:</strong> {contentType} (confidence:{" "}
        {Math.round(detection.confidence * 100)}%)
        <br />
        <strong>Reasons:</strong> {detection.reasons.join(", ")}
      </div>
    ) : null;

  // Render based on content type
  switch (contentType) {
    case "markdown":
      return (
        <div className={className}>
          {debugInfo}
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Custom styling for markdown elements
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold mb-4 text-gray-900">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold mb-3 text-gray-900">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  {children}
                </h3>
              ),
              h4: ({ children }) => (
                <h4 className="text-lg font-bold mb-2 text-gray-900">
                  {children}
                </h4>
              ),
              h5: ({ children }) => (
                <h5 className="text-base font-bold mb-2 text-gray-900">
                  {children}
                </h5>
              ),
              h6: ({ children }) => (
                <h6 className="text-sm font-bold mb-2 text-gray-900">
                  {children}
                </h6>
              ),
              p: ({ children }) => (
                <p className="mb-4 leading-relaxed text-gray-700">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-700">
                  {children}
                </ol>
              ),
              li: ({ children }) => <li className="mb-1">{children}</li>,
              code: ({ children, className }) => {
                const isInline = !className;
                return isInline ? (
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                    {children}
                  </code>
                ) : (
                  <code
                    className={`${className} bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800`}
                  >
                    {children}
                  </code>
                );
              },
              pre: ({ children }) => (
                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4 font-mono text-sm">
                  {children}
                </pre>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-blue-500 pl-4 italic mb-4 text-gray-700 bg-blue-50 py-2">
                  {children}
                </blockquote>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-blue-600 hover:text-blue-800 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              strong: ({ children }) => (
                <strong className="font-bold text-gray-900">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="italic text-gray-800">{children}</em>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full border border-gray-300">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="border border-gray-300 px-4 py-2 bg-gray-100 font-bold text-left">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-gray-300 px-4 py-2">{children}</td>
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
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      );

    case "plain":
    default:
      return (
        <div className={className}>
          {debugInfo}
          <div className="prose prose-lg max-w-none">
            <p className="whitespace-pre-wrap text-gray-700">{content}</p>
          </div>
        </div>
      );
  }
} 