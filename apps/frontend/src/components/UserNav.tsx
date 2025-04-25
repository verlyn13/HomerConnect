"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function UserNav() {
  const supabase = createClient();
  const router = useRouter();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // On sign-out (session becomes null), redirect only if not on a public auth page
      if (session === null) {
        const path = window.location.pathname;
        const publicPaths = ['/login', '/signup'];
        // allow reset-password pages too
        const isResetPath = path.startsWith('/reset-password');
        if (!publicPaths.includes(path) && !isResetPath) {
          router.push('/login');
        }
      }
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    router.push("/");
  };

  return (
    <nav className="bg-gray-100 p-4">
      {session ? (
        <button onClick={handleLogout} className="text-blue-500 hover:underline">
          Logout
        </button>
      ) : (
        <>
          <a href="/login" className="mr-4 text-blue-500 hover:underline">
            Login
          </a>
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </a>
        </>
      )}
    </nav>
  );
}
