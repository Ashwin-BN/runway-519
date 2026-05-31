"use client";



import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/lib/firebase";
import { useEffect } from "react";
import { useRouter } from "next/navigation";



export default function LoginPage() {

  const router = useRouter();



  const login = async () => {

    try {

      const result = await signInWithPopup(auth, provider);

      const user = result.user;

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

        const user = await response.json();

        localStorage.setItem("role", user.role);

        router.push("/");

      } else {

        alert("Backend login failed");

      }

    } catch (error) {

      console.error("Login failed", error);

      alert("Login failed: " + error.message);

    }

  };



  useEffect(() => {

    const checkUser = async () => {

      if (auth.currentUser) {

        const token = await auth.currentUser.getIdToken();

        localStorage.setItem("token", token);

        const storedRole = localStorage.getItem("role");

        if (!storedRole) {

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {

            const user = await response.json();

            localStorage.setItem("role", user.role);

          }

        }

        router.push("/");

      }

    };

    checkUser();

  }, [router]);



  return (

  <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center px-6 sm:px-8 lg:px-12">

    <div className="max-w-md w-full">

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-8">

        

        {/* Logo */}

        <div className="text-center mb-8">

          <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">

            <svg

              className="w-8 h-8 text-white"

              fill="none"

              stroke="currentColor"

              viewBox="0 0 24 24"

            >

              <path

                strokeLinecap="round"

                strokeLinejoin="round"

                strokeWidth={1.5}

                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"

              />

            </svg>

          </div>



          <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100 mb-2">

            Runway 519

          </h1>



          <p className="text-lg text-slate-600 dark:text-slate-400">

            Inventory Management System

          </p>

        </div>



        {/* Header */}

        <div className="text-center mb-8">

          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">

            Sign In

          </h2>



          <p className="text-base text-slate-600 dark:text-slate-400">

            Click below to authenticate with Google

          </p>

        </div>



        {/* Google Button */}

        {/* Google Button */}
        <div className="space-y-4">

          <button

            onClick={login}

            className="w-full inline-flex items-center justify-center px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-200"

          >

            <svg

              className="w-5 h-5 mr-3"

              viewBox="0 0 24 24"

            >

              <path

                fill="#4285F4"

                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"

              />

              <path

                fill="#34A853"

                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"

              />

              <path

                fill="#FBBC05"

                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"

              />

              <path

                fill="#EA4335"

                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"

              />

            </svg>




            Continue with Google

          </button>



          <p className="text-sm text-slate-600 dark:text-slate-400 text-center">

            Access your fashion inventory management dashboard

          </p>


          <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
            Access your fashion inventory management dashboard
          </p>
        </div>



        {/* Divider */}

        <div className="relative my-8">

          <div className="absolute inset-0 flex items-center">

            <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>

          </div>




          <div className="relative flex justify-center text-sm">

            <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">

              Secure authentication

            </span>

          </div>

        </div>



        {/* Terms */}

        {/* Terms */}
        <div className="text-center">

          <p className="text-xs text-slate-500 dark:text-slate-400">

            By signing in, you agree to our terms of service and privacy policy

          </p>

        </div>



        {/* Footer */}

        <div className="text-center mt-8">

          <p className="text-sm text-slate-600 dark:text-slate-400">

            Runway Inventory Management System

          </p>




          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">

            Professional fashion retail operations

          </p>

        </div>

        </div>
      </div>

    </div>
  );
}