import { NextResponse, NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();

    // Create Supabase client on the Edge
    const supabase = createMiddlewareClient({ req, res });

    // Refresh session if needed & set cookies
    await supabase.auth.getSession();

    // Protect dashboard routes
    if (req.nextUrl.pathname.startsWith("/dashboard")) {
        const {
            data: { session },
        } = await supabase.auth.getSession();

      if (!session) {
          return NextResponse.redirect(new URL("/login", req.url));
      }
  }

    return res;
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}; 