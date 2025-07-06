"use client";

export function useAuth() {
    // Placeholder: Supabase removed
    const user = null;
    const isLoading = false;
    const error = null;
    const hasPermission = (_action: string) => false;
    return { user, isLoading, error, hasPermission };
} 