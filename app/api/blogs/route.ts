import { supabaseServerClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/blog_posts – Lấy danh sách tất cả blog posts
export async function GET() {
    const { data, error } = await supabaseServerClient
        .from("blog_posts")
        .select("*")
        .order("published_at", { ascending: false });

    if (error)
        return NextResponse.json({ message: error.message }, { status: 500 });

    return NextResponse.json(data);
}

// POST /api/blog_posts – Tạo blog post mới
export async function POST(request: NextRequest) {
    const body = await request.json();

    const { data, error } = await supabaseServerClient
        .from("blog_posts")
        .insert(body)
        .select("*")
        .single();

    if (error)
        return NextResponse.json({ message: error.message }, { status: 500 });

    return NextResponse.json(data, { status: 201 });
} 