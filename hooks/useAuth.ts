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

    const hasPermission = (action: string) => {
        // TODO: Implement permission logic based on user role
        return true;
    };

    return { user, isLoading, error, hasPermission };
} 