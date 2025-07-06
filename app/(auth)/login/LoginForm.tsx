"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";

const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Minimum 6 characters" }),
});

type LoginValues = z.infer<typeof LoginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (values: LoginValues) => {
    setErrorMessage(null);
    const res = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });
    if (res?.error) {
      setErrorMessage("Invalid email or password");
      return;
    }
    router.push("/dashboard");
    console.log("Login successful");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="w-full rounded border px-3 py-2"
          {...register("email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="w-full rounded border px-3 py-2"
          {...register("password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        {errors.password && (
          <p className="text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      {errorMessage && (
        <p className="text-sm text-red-600 text-center">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
