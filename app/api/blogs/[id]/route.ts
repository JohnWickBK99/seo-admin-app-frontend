import { supabaseServerClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

interface RouteProps {
    params: { id: string };
}

// GET /api/blog_posts/:id – Lấy chi tiết blog post
export async function GET(_request: NextRequest, { params }: RouteProps) {
    const { id } = params;
    const { data, error } = await supabaseServerClient
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .single();

    if (error)
        return NextResponse.json({ message: error.message }, { status: 404 });

    return NextResponse.json(data);
}

// PUT /api/blog_posts/:id – Cập nhật blog post
export async function PUT(request: NextRequest, { params }: RouteProps) {
    const { id } = params;
    const body = await request.json();

    const { data, error } = await supabaseServerClient
        .from("blog_posts")
        .update(body)
        .eq("id", id)
        .select("*")
        .single();

    if (error)
        return NextResponse.json({ message: error.message }, { status: 500 });

    return NextResponse.json(data);
}

// DELETE /api/blog_posts/:id – Xoá blog post
export async function DELETE(_request: NextRequest, { params }: RouteProps) {
    const { id } = params;
    const { error } = await supabaseServerClient
        .from("blog_posts")
        .delete()
        .eq("id", id);

    if (error)
        return NextResponse.json({ message: error.message }, { status: 500 });

    return NextResponse.json({ message: "Deleted" }, { status: 204 });
} 