"use client";

import GoogleSignIn from "@/components/auth/GoogleSignIn";
import { useAuth } from "@/lib/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { getReturnUrl, USER_EMAIL_INBOX } from "@/lib/userIdentity";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("return_url");

  useEffect(() => {
    // If user is already logged in, redirect to return URL or dashboard
    if (!loading && user) {
      const destination = returnUrl || "/";
      // If return URL is external (like Gmail), use window.location
      if (returnUrl && (returnUrl.startsWith("http://") || returnUrl.startsWith("https://"))) {
        window.location.href = returnUrl;
      } else {
        router.push(destination);
      }
    }
  }, [user, loading, router, returnUrl]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 animate-pulse">
            🪙
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Path Coin Dashboard</h1>
          <p className="text-neutral-400">Loading...</p>
          <div className="mt-4 animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  // Show sign-in UI if no user
  if (!user) {
    return <GoogleSignIn returnUrl={returnUrl || getReturnUrl()} />;
  }

  return null;
}
