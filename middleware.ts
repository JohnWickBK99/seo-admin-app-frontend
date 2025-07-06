import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    // Chỉ bảo vệ route /dashboard
    if (req.nextUrl.pathname.startsWith("/dashboard")) {
        // Lấy token từ cookie (NextAuth JWT)
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        // Nếu chưa đăng nhập hoặc không phải admin thì redirect về /login
        if (!token || token.role !== "admin") {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
}; 