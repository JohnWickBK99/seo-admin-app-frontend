import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/blog_posts – Lấy danh sách tất cả blog posts
export async function GET() {
    try {
        const data = await prisma.blog_posts.findMany({
            orderBy: { published_at: "desc" },
        });
        return NextResponse.json(data);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ message }, { status: 500 });
    }
}

// POST /api/blog_posts – Tạo blog post mới
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const data = await prisma.blog_posts.create({
            data: body,
        });
        return NextResponse.json(data, { status: 201 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ message }, { status: 500 });
    }
} 