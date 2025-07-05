import { createClient } from "@supabase/supabase-js";

// Một số môi trường (local dev) có thể chưa cấu hình `SUPABASE_SERVICE_ROLE_KEY`.
// Trong trường hợp đó, fallback về anon key để tránh crash (chỉ có quyền đọc).
// Khuyến nghị: luôn đặt `SUPABASE_SERVICE_ROLE_KEY` trên server để hỗ trợ CRUD đầy đủ.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
    throw new Error("Missing env:NEXT_PUBLIC_SUPABASE_URL");
}

// Ưu tiên service role key, nếu không có dùng anon key (chỉ đọc)
const supabaseKey = supabaseServiceKey || supabaseAnonKey;

if (!supabaseKey) {
    throw new Error("Missing Supabase key. Set SUPABASE_SERVICE_ROLE_KEY (server) hoặc NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export const supabaseServerClient = createClient(supabaseUrl, supabaseKey); 