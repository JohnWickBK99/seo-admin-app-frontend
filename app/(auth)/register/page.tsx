"use client";

import Link from "next/link";
import RegisterForm from "./RegisterForm";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6">
          <h1 className="text-center text-2xl font-bold">Register</h1>
          <RegisterForm />
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
