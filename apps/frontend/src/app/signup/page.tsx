"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function SignupPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    // For development only - enables automatic confirmation of emails
    // In production, this should be removed to enforce email verification
    const options = {
      emailRedirectTo: `${window.location.origin}/login`,
      // Uncomment the following line for local development to bypass email verification
      // data: { email_confirmed: true }
    };

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      // Check if email confirmation is required
      if (data?.user?.identities?.length === 0) {
        setErrorMsg("This email is already registered. Please check your inbox for the confirmation email or try logging in.");
      } else if (data?.user?.confirmed_at) {
        setErrorMsg("Account created! You can log in now.");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setErrorMsg("Please check your email for a confirmation link before logging in.");
      }

      setTimeout(() => router.push("/login"), 5000);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSignup} className="w-full max-w-sm p-6 bg-white rounded shadow">
        <h1 className="mb-4 text-2xl font-bold">Sign Up</h1>
        {errorMsg && <div className="mb-4 text-red-600">{errorMsg}</div>}

        <div className="mb-4">
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded"
            minLength={6}
          />
          <p className="mt-1 text-xs text-gray-500">Password must be at least 6 characters long</p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          {isLoading ? "Loading..." : "Sign Up"}
        </button>

        {/* Link to login page */}
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">Already have an account? </span>
          <a href="/login" className="text-sm text-blue-600 hover:underline">
            Login
          </a>
        </div>

        {/* Social signup/login options */}
        <div className="mt-6 border-t pt-4 space-y-3">
          <button
            type="button"
            onClick={() => supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })}
            className="w-full py-2 text-gray-700 bg-white border rounded hover:bg-gray-50 flex items-center justify-center"
          >
            Sign up with Google
          </button>
          <button
            type="button"
            onClick={() => supabase.auth.signInWithOAuth({ provider: 'github', options: { redirectTo: window.location.origin } })}
            className="w-full py-2 text-gray-700 bg-white border rounded hover:bg-gray-50 flex items-center justify-center"
          >
            Sign up with GitHub
          </button>
        </div>

        {/* Development note for email confirmation */}
        <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-gray-600">
          <p>
            <strong>Note:</strong> Email confirmation is required. Check your inbox after signup.
          </p>
          <p className="mt-1">
            For development, you can bypass email confirmation by uncommenting line 26 in this file.
          </p>
        </div>
      </form>
    </div>
  );
}
