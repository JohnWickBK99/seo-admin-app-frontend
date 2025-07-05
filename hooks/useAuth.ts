"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useAuth() {
    const {
        data: user,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["auth", "user"],
        queryFn: async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error) throw error;
            return data.user;
        },
        staleTime: 1000 * 60 * 5,
    });

    const role = (user?.user_metadata as { role?: string } | null)?.role ?? "viewer";

    const rolePermissions: Record<string, string[]> = {
        admin: ["*"],
        editor: [
            "posts:create",
            "posts:update",
            "posts:delete",
            "categories:create",
            "categories:update",
            "categories:delete",
        ],
        viewer: ["posts:view", "categories:view"],
    };

    const hasPermission = (action: string) => {
        const allowed = rolePermissions[role] ?? [];
        return allowed.includes("*") || allowed.includes(action);
    };

    return { user, isLoading, error, hasPermission };
} 