"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "@/lib/api";
import Head from "next/head";

// ✅ Validation schema
const RegisterSchema = Yup.object().shape({
  user_name: Yup.string()
    .min(2, "Name is too short")
    .required("Name is required"),
  user_email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function RegisterPage() {
  const router = useRouter();
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (values: {
    user_name: string;
    user_email: string;
    password: string;
  }) => {
    setIsLoading(true);
    try {
      await api.post("/auth/register/", values);
      router.push("/login");
    } catch (error) {
      setAlert({
        type: "error",
        message:
          error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (alert) {
      const timeout = setTimeout(() => setAlert(null), 4000);
      return () => clearTimeout(timeout);
    }
  }, [alert]);

  return (
    <>
      <Head>
        <title>Register | My App</title>
        <meta name="description" content="Create your free account on My App and start organizing your tasks today." />
      </Head>

      <div className="flex min-h-screen items-center justify-center bg-black p-4 relative">
        {alert && (
          <div
            className={`absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-md text-sm font-medium ${
              alert.type === "success"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {alert.message}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 text-white shadow-md p-6">
            <h2 className="text-2xl font-bold mb-1">Create an account</h2>
            <p className="text-zinc-400 mb-6">
              Enter your information to register
            </p>

            <Formik
              initialValues={{
                user_name: "",
                user_email: "",
                password: "",
              }}
              validationSchema={RegisterSchema}
              onSubmit={handleRegister}
            >
              <Form className="space-y-4">
                {/* Name */}
                <div>
                  <label
                    htmlFor="user_name"
                    className="block text-sm font-medium text-zinc-300 mb-1"
                  >
                    Name
                  </label>
                  <Field
                    id="user_name"
                    name="user_name"
                    type="text"
                    placeholder="John Doe"
                    className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <ErrorMessage name="user_name" component="div" className="text-red-400 text-sm mt-1" />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="user_email"
                    className="block text-sm font-medium text-zinc-300 mb-1"
                  >
                    Email
                  </label>
                  <Field
                    id="user_email"
                    name="user_email"
                    type="email"
                    placeholder="example@example.com"
                    className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <ErrorMessage name="user_email" component="div" className="text-red-400 text-sm mt-1" />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-zinc-300 mb-1"
                  >
                    Password
                  </label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-400 text-sm mt-1" />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-md bg-zinc-100 text-black py-2 font-semibold hover:bg-white transition disabled:opacity-50"
                >
                  {isLoading ? "Creating account..." : "Register"}
                </button>
              </Form>
            </Formik>

            <div className="text-sm text-zinc-400 mt-6 text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-white hover:underline">
                Login
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
