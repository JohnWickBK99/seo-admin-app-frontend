import { NextRequest, NextResponse } from 'next/server';
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
    const parsedData = await req.json();

    if (!parsedData || typeof parsedData !== 'object') {
      return NextResponse.json({ message: 'Dữ liệu không hợp lệ' }, { status: 400 });
    }

    // Lấy content từ dữ liệu đã phân tích
    const { content, word_count, lead_image_url } = parsedData;

    // Kiểm tra content có tồn tại không
    if (!content || typeof content !== 'string') {
      return NextResponse.json({ message: 'Nội dung không hợp lệ' }, { status: 400 });
    }

    try {
      // Xử lý các công việc đồng thời
      const [rewrittenContent, title, excerpt] = await Promise.all([
        rewriteContent(content),
        generateTitle(content),
        generateExcerpt(content)
      ]);

      // Tính số từ và thời gian đọc từ nội dung đã viết lại
      const { wordCount, readTimeMinutes } = calculateWordCountAndReadTime(rewrittenContent);

      // Kết hợp kết quả
      const result = {
        title,
        content: rewrittenContent,
        excerpt,
        word_count: wordCount,
        read_time: readTimeMinutes,
        image_url: lead_image_url,
      };

      return NextResponse.json(result);
    } catch (processError) {
      console.error('Processing error:', processError);
      return NextResponse.json({ 
        message: 'Lỗi khi xử lý nội dung', 
        details: processError instanceof Error ? processError.message : 'Unknown error' 
      }, { status: 500 });
    }
  } catch (error: unknown) {
    console.error('Generation error:', error);
    return NextResponse.json({ 
      message: 'Lỗi khi tạo nội dung', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 