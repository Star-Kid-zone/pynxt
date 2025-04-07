/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setToken } from "@/redux/slices/authSlice";
import api from "@/lib/api";
import Head from "next/head";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// ✅ Yup Validation Schema
const LoginSchema = Yup.object().shape({
  user_email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function LoginPage() {
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async (values: { user_email: string; password: string }) => {
    try {
      setIsLoading(true);
      setApiError(null);

      const response = await api.post("/auth/login/", {
        user_email: values.user_email,
        password: values.password,
      });

      const token = response.data?.data?.token;
      if (!token) throw new Error("Invalid response from server");

      localStorage.setItem("jwt", token);
      document.cookie = `jwt=${token}; path=/`;

      dispatch(setToken(token));
      router.push("/note");
    } catch (err: any) {
      console.error("Login error:", err);
      alert("something went wrong")
      // setApiError(
      //   err?.response?.data?.detail ||
      //   err?.message ||
      //   "Something went wrong. Please try again."
      // );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | My App</title>
        <meta name="description" content="Secure login to access your account on My App." />
      </Head>

      <main className="flex justify-center items-center min-h-screen bg-black text-white px-4">
        <div className="w-full max-w-md bg-[#121212] rounded-xl border border-[#222] shadow-lg">
          <div className="p-8">
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-bold mb-2">Sign in</h1>
              <p className="text-sm text-zinc-400">Access your account securely</p>
            </div>

            <Formik
              initialValues={{ user_email: "", password: "" }}
              validationSchema={LoginSchema}
              onSubmit={handleLogin}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-5">
                  <div>
                    <label htmlFor="user_email" className="block text-sm font-medium text-zinc-400">
                      Email
                    </label>
                    <Field
                      name="user_email"
                      type="email"
                      placeholder="you@example.com"
                      className="w-full mt-1 px-3 py-2 bg-zinc-900 text-white border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-600"
                    />
                    <ErrorMessage
                      name="user_email"
                      component="div"
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-zinc-400">
                      Password
                    </label>
                    <Field
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      className="w-full mt-1 px-3 py-2 bg-zinc-900 text-white border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-600"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>

                  {apiError && (
                    <div className="p-3 border border-red-600 bg-[#1a0000] text-red-400 rounded-md text-sm">
                      {apiError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="w-full py-2 px-4 bg-white text-black font-semibold rounded-md hover:bg-zinc-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting || isLoading ? "Logging in..." : "Login"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </main>
    </>
  );
}
