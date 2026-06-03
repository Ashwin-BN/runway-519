"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth, provider } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuthSuccess = async (user) => {
    try {
      setLoading(true);
      setError("");
      const token = await user.getIdToken();
      localStorage.setItem("token", token);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("role", data.role);
        router.push("/");
      } else {
        const errorData = await response.json();
        setError(`Backend error: ${errorData.error || "Unknown error"}`);
        console.error("Backend login failed:", errorData);
      }
    } catch (err) {
      setError(`Auth error: ${err.message}`);
      console.error("handleAuthSuccess error:", err);
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("🔐 Initiating Google Sign-In redirect...");
      console.log("🔐 Auth domain:", auth.app.options.authDomain);
      await signInWithRedirect(auth, provider);
      console.log("🔐 Redirect initiated, user should be redirected to Google...");
    } catch (error) {
      setLoading(false);
      const errorMsg = `${error.code}: ${error.message}`;
      setError(errorMsg);
      console.error("❌ Login redirect failed", errorMsg);
    }
  };

  useEffect(() => {
    const checkRedirectResult = async () => {
      console.log("🔍 Starting redirect check...");
      
      try {
        console.log("🔍 Getting redirect result...");
        const redirectResult = await getRedirectResult(auth);
        console.log("🔍 Redirect result:", redirectResult);
        
        if (redirectResult?.user) {
          console.log("✅ User found in redirect result:", redirectResult.user.email);
          await handleAuthSuccess(redirectResult.user);
          return;
        }
      } catch (redirectError) {
        console.error("❌ Redirect result error:", redirectError.code, redirectError.message);
        setError(`Redirect error: ${redirectError.message}`);
      }

      // Check if already logged in
      console.log("🔍 Checking current user...");
      const currentUser = auth.currentUser;
      console.log("🔍 Current user:", currentUser?.email || "none");
      
      if (currentUser) {
        console.log("✅ User already logged in:", currentUser.email);
        try {
          const token = await currentUser.getIdToken();
          console.log("✅ Got token, length:", token.length);
          localStorage.setItem("token", token);

          const storedRole = localStorage.getItem("role");
          console.log("🔍 Stored role:", storedRole || "none");
          
          if (!storedRole) {
            console.log("🔍 No stored role, calling backend...");
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });

            console.log("🔍 Backend response status:", response.status);
            if (response.ok) {
              const data = await response.json();
              console.log("✅ Backend login success, role:", data.role);
              localStorage.setItem("role", data.role);
            } else {
              const errorData = await response.json();
              console.error("❌ Backend login failed:", errorData);
            }
          }
          
          console.log("🔍 Pushing to home page...");
          router.push("/");
        } catch (err) {
          console.error("❌ Error checking existing user:", err);
          setError(`Error: ${err.message}`);
        }
      } else {
        console.log("ℹ️ No user logged in, waiting for user to click login button");
      }
    };

    checkRedirectResult();
  }, [router]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center px-6 sm:px-8 lg:px-12">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Runway 519</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">Inventory Management System</p>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">Sign In</h2>
            <p className="text-base text-slate-600 dark:text-slate-400">Click below to authenticate with Google</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={() => {
                console.log("🔘 Login button clicked!");
                login();
              }}
              disabled={loading}
              className="w-full inline-flex items-center justify-center px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className={`w-5 h-5 mr-3 ${loading ? "animate-spin" : ""}`} viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {loading ? "Redirecting..." : "Continue with Google"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

