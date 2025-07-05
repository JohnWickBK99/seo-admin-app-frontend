"use client";

import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-center text-2xl font-bold">Register</h1>
        {/* TODO: Replace with actual registration form */}
        <div className="flex justify-center">
          <Link href="/login" className="underline text-blue-600">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </main>
  );
}
