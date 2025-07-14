import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Khởi tạo Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// Hàm tính số từ và thời gian đọc
function calculateWordCountAndReadTime(content: string) {
  const wordCount = content.trim().split(/\s+/).length;
  // Tốc độ đọc trung bình: 200-250 từ/phút
  const readTimeMinutes = Math.ceil(wordCount / 225);
  return { wordCount, readTimeMinutes };
}

// Hàm viết lại nội dung
async function rewriteContent(content: string) {
  const prompt = `
  Viết lại nội dung sau đây thành một bài blog chất lượng cao, được định dạng với Markdown:

  ${content.substring(0, 100000)}

  Yêu cầu:
  1. Sử dụng Markdown đúng cách với các thẻ heading h1, h2, h3 phù hợp
  2. Viết nội dung chuyên nghiệp, SEO-friendly
  3. Mở rộng mỗi phần với thông tin hữu ích, ví dụ, nghiên cứu và chi tiết bổ sung
  4. Bao gồm phần mở đầu, nội dung chính chia thành nhiều mục rõ ràng (ít nhất 5-7 mục), và phần kết luận
  5. Tập trung vào chất lượng và tính toàn diện của nội dung
  6. KHÔNG thêm bất kỳ cấu trúc JSON nào, chỉ trả về nội dung Markdown
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

// Hàm tạo tiêu đề
async function generateTitle(content: string) {
  const prompt = `
  Dựa vào nội dung sau đây, hãy tạo một tiêu đề hấp dẫn, ngắn gọn và tối ưu cho SEO:

  ${content.substring(0, 5000)}

  Chỉ trả về tiêu đề, không thêm bất kỳ giải thích hay định dạng nào khác.
  `;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

// Hàm tạo đoạn trích
async function generateExcerpt(content: string) {
  const prompt = `
  Dựa vào nội dung sau đây, hãy tạo một đoạn trích ngắn gọn (1-2 câu) tóm tắt nội dung chính:

  ${content.substring(0, 5000)}

  Chỉ trả về đoạn trích, không thêm bất kỳ giải thích hay định dạng nào khác.
  `;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ message: 'URL không hợp lệ' }, { status: 400 });
    }

    // Kiểm tra URL có hợp lệ không
    try {
      new URL(url);
    } catch (e) {
      return NextResponse.json({ message: 'URL không đúng định dạng' }, { status: 400 });
    }

    try {
      // Sử dụng Firecrawl API để scrape nội dung
      const firecrawlResponse = await axios.post('https://api.firecrawl.dev/v1/scrape', {
        url: url,
        formats: ['markdown'],
        onlyMainContent: true,
        parsePDF: true,
        maxAge: 14400000
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY || 'fc-315cda6181c24d1fb5febe4ba2137960'}`
        }
      });

      // Kiểm tra nếu scraping thành công
      if (!firecrawlResponse.data.success || !firecrawlResponse.data.data.markdown) {
        return NextResponse.json({ 
          message: 'Không thể lấy nội dung từ URL', 
          details: firecrawlResponse.data 
        }, { status: 400 });
      }

      // Lấy nội dung markdown và metadata
      const markdownContent = firecrawlResponse.data.data.markdown;
      const metadata = firecrawlResponse.data.data.metadata || {};

      // Xử lý nội dung với Gemini
      const [rewrittenContent, title, excerpt] = await Promise.all([
        rewriteContent(markdownContent),
        metadata.title ? Promise.resolve(metadata.title) : generateTitle(markdownContent),
        metadata.description ? Promise.resolve(metadata.description) : generateExcerpt(markdownContent)
      ]);

      // Tính số từ và thời gian đọc từ nội dung đã viết lại
      const { wordCount, readTimeMinutes } = calculateWordCountAndReadTime(rewrittenContent);

      // Kết hợp kết quả
      const result = {
        title: title,
        content: rewrittenContent,
        excerpt: excerpt,
        word_count: wordCount,
        read_time: readTimeMinutes,
        image_url: metadata['twitter:image:src'],
        // data: {
        //   markdown: rewrittenContent,
        //   metadata: {
        //     ...metadata,
        //   }
        // }
      };

      return NextResponse.json(result);

    } catch (scrapeError) {
      console.error('Scraping error:', scrapeError);
      
      if (axios.isAxiosError(scrapeError)) {
        if (scrapeError.response) {
          return NextResponse.json({ 
            message: `Lỗi từ Firecrawl API: ${scrapeError.response.status} ${scrapeError.response.statusText}`,
            details: scrapeError.response.data
          }, { status: scrapeError.response.status });
        }

        if (scrapeError.code === 'ECONNABORTED') {
          return NextResponse.json({ 
            message: 'Timeout khi kết nối đến Firecrawl API' 
          }, { status: 504 });
        }
      }

      return NextResponse.json({ 
        message: 'Lỗi khi scrape nội dung', 
        details: scrapeError instanceof Error ? scrapeError.message : 'Unknown error' 
      }, { status: 500 });
    }
  } catch (error: unknown) {
    console.error('General error:', error);
    return NextResponse.json({ 
      message: 'Lỗi không xác định', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 