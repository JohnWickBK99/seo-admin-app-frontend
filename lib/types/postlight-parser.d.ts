declare module '@postlight/parser' {
  interface ParseOptions {
    contentType?: string;
    headers?: Record<string, string>;
  }

  interface ParseResult {
    title?: string;
    content?: string;
    author?: string;
    date_published?: string;
    lead_image_url?: string;
    dek?: string;
    excerpt?: string;
    word_count?: number;
    direction?: string;
    url?: string;
    domain?: string;
    next_page_url?: string;
    rendered_pages?: number;
  }

  export function parse(url: string, options?: ParseOptions): Promise<ParseResult>;
} 