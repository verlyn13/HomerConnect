"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Improve error message handling
      if (error.message.includes("Email not confirmed")) {
        setErrorMsg(
          "Your email has not been confirmed yet. Please check your inbox for a confirmation link, " +
          "or click below to resend the confirmation email."
        );
        // Add a resend confirmation button in the UI
      } else {
        setErrorMsg(error.message);
      }
    } else {
      router.push("/");
    }

    setIsLoading(false);
  };

  // Function to resend confirmation email
  const handleResendConfirmation = async () => {
    if (!email) {
      setErrorMsg("Please enter your email address.");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    if (error) {
      setErrorMsg(`Error resending confirmation email: ${error.message}`);
    } else {
      setErrorMsg("Confirmation email resent. Please check your inbox.");
    }

    setIsLoading(false);
  };

  // Check if the error message is about email not being confirmed
  const isEmailNotConfirmedError = errorMsg && errorMsg.includes("not been confirmed");

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleLogin} className="w-full max-w-sm p-6 bg-white rounded shadow">
        <h1 className="mb-4 text-2xl font-bold">Login</h1>
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
          />
        </div>

        {/* Login button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          {isLoading ? "Loading..." : "Login"}
        </button>
        <p className="mt-4 text-center">
          <a href="/reset-password" className="text-blue-500 hover:underline">
            Forgot your password?
          </a>
        </p>

        {/* Resend confirmation email button - only show when there's an email confirmation error */}
        {isEmailNotConfirmedError && (
          <button
            type="button"
            onClick={handleResendConfirmation}
            disabled={isLoading}
            className="w-full py-2 mt-2 text-blue-600 bg-transparent border border-blue-600 rounded hover:bg-blue-50"
          >
            Resend Confirmation Email
          </button>
        )}

        {/* Link to signup page */}
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">Don&apos;t have an account? </span>
          <a href="/signup" className="text-sm text-blue-600 hover:underline">
            Sign up
          </a>
        </div>

        {/* Social login options */}
        <div className="mt-6 border-t pt-4 space-y-3">
          <button
            type="button"
            onClick={() => supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })}
            className="w-full py-2 text-gray-700 bg-white border rounded hover:bg-gray-50 flex items-center justify-center"
          >
            Continue with Google
          </button>
          <button
            type="button"
            onClick={() => supabase.auth.signInWithOAuth({ provider: 'github', options: { redirectTo: window.location.origin } })}
            className="w-full py-2 text-gray-700 bg-white border rounded hover:bg-gray-50 flex items-center justify-center"
          >
            Continue with GitHub
          </button>
        </div>
      </form>
    </div>
  );
}
