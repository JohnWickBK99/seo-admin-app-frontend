import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/blog_posts/:id – Lấy chi tiết blog post
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const data = await prisma.blog_posts.findUnique({
            where: { id },
        });
        if (!data) {
            return NextResponse.json({ message: "Not found" }, { status: 404 });
        }
        return NextResponse.json(data);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ message }, { status: 500 });
    }
}

// PUT /api/blog_posts/:id – Cập nhật blog post
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const data = await prisma.blog_posts.update({
            where: { id },
            data: body,
        });
        return NextResponse.json(data);
    } catch (error: unknown) {
        if (typeof error === 'object' && error && 'code' in error && (error as { code?: string }).code === 'P2025') {
            return NextResponse.json({ message: "Not found" }, { status: 404 });
        }
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ message }, { status: 500 });
    }
}

// DELETE /api/blog_posts/:id – Xoá blog post
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.blog_posts.delete({
            where: { id },
        });
        return NextResponse.json({ message: "Deleted" }, { status: 204 });
    } catch (error: unknown) {
        if (typeof error === 'object' && error && 'code' in error && (error as { code?: string }).code === 'P2025') {
            return NextResponse.json({ message: "Not found" }, { status: 404 });
        }
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ message }, { status: 500 });
    }
} 