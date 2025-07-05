"use client";

import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-center text-2xl font-bold">Login</h1>
        {/* TODO: Replace with actual form implementation */}
        <div className="flex justify-center">
          <Link href="/dashboard" className="underline text-blue-600">
            Continue to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
