import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Khởi tạo Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// Hàm dịch nội dung từ tiếng Việt sang tiếng Anh
async function translateToEnglish(content: string) {
  const prompt = `
  Translate the following Vietnamese content to professional, high-quality English. 
  Maintain the original formatting including Markdown if present.
  Return only the translated content without any explanations or comments.

  Vietnamese content:
  ${content}
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();

    // Kiểm tra nội dung đầu vào
    if (!content || typeof content !== 'string') {
      return NextResponse.json({ 
        success: false, 
        message: 'Nội dung không hợp lệ. Vui lòng cung cấp nội dung dạng chuỗi để dịch.' 
      }, { status: 400 });
    }

    // Giới hạn kích thước nội dung để tránh quá tải API
    if (content.length > 100000) {
      return NextResponse.json({
        success: false,
        message: 'Nội dung quá dài. Vui lòng giới hạn trong 100,000 ký tự.'
      }, { status: 400 });
    }

    try {
      // Thực hiện dịch nội dung
      const translatedContent = await translateToEnglish(content);

      // Trả về kết quả
      return NextResponse.json({
        success: true,
        data: {
          original: content,
          translated: translatedContent,
          source_language: 'Vietnamese',
          target_language: 'English'
        }
      });
    } catch (translationError) {
      console.error('Translation error:', translationError);
      
      return NextResponse.json({
        success: false,
        message: 'Lỗi khi dịch nội dung',
        details: translationError instanceof Error ? translationError.message : 'Unknown error'
      }, { status: 500 });
    }
  } catch (error: unknown) {
    console.error('General error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Lỗi không xác định',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 