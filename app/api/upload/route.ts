import { NextResponse } from 'next/server';
import FormData from 'form-data';
import fs from 'fs';
import axios from 'axios';
import path from 'path';
import { writeFile } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: { bodyParser: false },
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'File type not allowed' }, { status: 400 });
    }

    // Get file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create temp file path with unique name
    const tempDir = path.join(process.cwd(), 'tmp');
    
    // Create tmp directory if it doesn't exist
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    const fileName = `${uuidv4()}-${file.name.replace(/\s/g, '_')}`;
    const tempPath = path.join(tempDir, fileName);
    
    // Write file to temp location
    await writeFile(tempPath, buffer);

    // Upload to Zipline
    const uploadForm = new FormData();
    uploadForm.append('file', fs.createReadStream(tempPath), file.name);

    const ziplineRes = await axios.post(
      `${process.env.ZIPLINE_API_URL}/api/upload`,
      uploadForm,
      {
        headers: {
          ...uploadForm.getHeaders(),
          'Authorization': process.env.ZIPLINE_API_KEY,
        },
      }
    );

    // Remove temp file
    fs.unlinkSync(tempPath);

    // Return Zipline response
    return NextResponse.json(ziplineRes.data.files[0]);
  } catch (error: unknown) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: 'Upload error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 