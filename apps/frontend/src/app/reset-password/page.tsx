"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function ResetPasswordRequestPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");
    const { error } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: `${window.location.origin}/reset-password/update` }
    );
    if (error) {
      setError(error.message);
    } else {
      setMessage(
        "If that email is registered, a password reset link has been sent."
      );
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 bg-white rounded shadow space-y-4"
      >
        <h1 className="text-2xl font-bold">Reset Password</h1>
        {message && <div className="text-green-600">{message}</div>}
        {error && <div className="text-red-600">{error}</div>}
        <div>
          <label htmlFor="email" className="block mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}
