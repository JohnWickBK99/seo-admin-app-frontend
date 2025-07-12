import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as Mercury from '@postlight/parser';

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
      // Sử dụng Mercury Parser để parse nội dung từ URL
      const result = await Mercury.parse(url, {
        contentType: 'html',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      });

      // Trả về dữ liệu đã được parse
      return NextResponse.json({
        result,
        url
      });
    } catch (parseError) {
      console.error('Mercury parsing error:', parseError);
      
      // Nếu Mercury parser gặp lỗi, thử phương pháp dự phòng với axios
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
        timeout: 15000,
      });

      // Trả về HTML nếu parsing không thành công
      return NextResponse.json({ 
        html: response.data,
        url: url,
        message: 'Không thể parse nội dung với Mercury Parser, trả về HTML thô'
      });
    }
  } catch (error: unknown) {
    console.error('Scraping error:', error);
    
    // Xử lý các lỗi cụ thể
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        return NextResponse.json({ 
          message: 'Timeout khi kết nối đến trang web' 
        }, { status: 504 });
      }

      if (error.response) {
        // Lỗi từ phản hồi của server
        return NextResponse.json({ 
          message: `Lỗi khi tải trang web: ${error.response.status} ${error.response.statusText}` 
        }, { status: error.response.status });
      }
    }

    // Lỗi khác
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : 'Lỗi không xác định' 
    }, { status: 500 });
  }
} 