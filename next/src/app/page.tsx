"use client";

import { useRouter } from "next/navigation";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center gap-6">
      <button
        onClick={() => router.push("/login")}
        className="flex items-center gap-2 text-white border border-white px-4 py-2 rounded hover:bg-white hover:text-black transition"
      >
        <FaSignInAlt />
        Login
      </button>
      <button
        onClick={() => router.push("/register")}
        className="flex items-center gap-2 text-white border border-white px-4 py-2 rounded hover:bg-white hover:text-black transition"
      >
        <FaUserPlus />
        Register
      </button>
    </div>
  );
}
