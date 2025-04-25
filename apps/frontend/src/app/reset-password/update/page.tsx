"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function ResetPasswordUpdatePage() {
  const supabase = createClient();
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const handleSession = async () => {
      // Parse session from URL for password recovery
      const {
        data,
        error: urlError
      } = await supabase.auth.getSessionFromUrl();
      if (urlError) {
        setError(urlError.message);
      } else if (!data.session) {
        setError("Invalid or expired password reset link.");
      } else {
        setReady(true);
      }
    };
    handleSession();
  }, [supabase]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    setError("");
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (updateError) {
      setError(updateError.message);
    } else {
      setMessage("Your password has been updated successfully.");
      setTimeout(() => router.push("/login"), 2000);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md p-6 bg-white rounded shadow space-y-4">
        <h1 className="text-2xl font-bold">Set New Password</h1>
        {message && <div className="text-green-600">{message}</div>}
        {error && <div className="text-red-600">{error}</div>}
        {ready ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block mb-1">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        ) : (
          <div>Processing link, please wait...</div>
        )}
      </div>
    </div>
  );
}
