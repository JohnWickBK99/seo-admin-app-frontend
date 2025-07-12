/**
 * Utility for detecting content types (HTML, Markdown, Plain Text)
 */

type ContentType = 'html' | 'markdown' | 'plain';

type DetectionResult = {
  type: ContentType;
  confidence: number;
  reasons: string[];
};

/**
 * Simple detection of content type based on common patterns
 */
export function detectContentType(content: string): ContentType {
  const detection = detectContentTypeWithConfidence(content);
  return detection.type;
}

/**
 * Detailed detection with confidence score and reasons
 */
export function detectContentTypeWithConfidence(content: string): DetectionResult {
  if (!content || typeof content !== 'string') {
    return {
      type: 'plain',
      confidence: 1,
      reasons: ['Empty or invalid content']
    };
  }

  const trimmedContent = content.trim();

  // HTML detection patterns
  const htmlPatterns = {
    tags: /<([a-z][a-z0-9]*)\b[^>]*>([\s\S]*?)<\/\1>/i,
    selfClosingTags: /<([a-z][a-z0-9]*)\b[^>]*\/>/i,
    doctype: /<!DOCTYPE html>/i,
    htmlComment: /<!--[\s\S]*?-->/
  };

  // Markdown detection patterns
  const mdPatterns = {
    headers: /^#{1,6}\s+.+$/m,
    lists: /^[*+-]\s+.+$/m,
    orderedLists: /^\d+\.\s+.+$/m,
    blockquotes: /^>\s+.+$/m,
    codeBlocks: /^```[\s\S]*?```$/m,
    links: /\[.+?\]\(.+?\)/,
    emphasis: /(\*\*|__).+?(\*\*|__)/,
    italics: /(\*|_).+?(\*|_)/,
    tables: /^\|.+\|$/m
  };

  // Count matches for HTML patterns
  let htmlScore = 0;
  let htmlReasons: string[] = [];

  Object.entries(htmlPatterns).forEach(([key, pattern]) => {
    if (pattern.test(trimmedContent)) {
      htmlScore++;
      htmlReasons.push(`Contains ${key}`);
    }
  });

  // Count matches for Markdown patterns
  let mdScore = 0;
  let mdReasons: string[] = [];

  Object.entries(mdPatterns).forEach(([key, pattern]) => {
    if (pattern.test(trimmedContent)) {
      mdScore++;
      mdReasons.push(`Contains ${key}`);
    }
  });

  // Calculate confidence scores
  const htmlConfidence = htmlScore / Object.keys(htmlPatterns).length;
  const mdConfidence = mdScore / Object.keys(mdPatterns).length;

  // Make the final determination
  if (htmlScore > mdScore && htmlScore > 0) {
    return {
      type: 'html',
      confidence: htmlConfidence,
      reasons: htmlReasons
    };
  } else if (mdScore > 0) {
    return {
      type: 'markdown',
      confidence: mdConfidence,
      reasons: mdReasons
    };
  } else {
    return {
      type: 'plain',
      confidence: 1,
      reasons: ['No HTML or Markdown patterns detected']
    };
  }
} 