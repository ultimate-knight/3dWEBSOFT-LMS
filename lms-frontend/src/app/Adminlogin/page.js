"use client";

import { useState } from "react";
import api, { getApiErrorMessage } from "@/lib/page";
import { setAuthSession } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const [details, setDetails] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const email = details.email.trim().toLowerCase();
      const res = await api.post("/adminlogin", {
        email,
        password: details.password,
      });

      const token = res.data?.jwtToken;
      if (!token) {
        setError("Login succeeded but no token was returned.");
        return;
      }

      setAuthSession({
        token,
        role: "admin",
        name: res.data.username || "",
      });

      setDetails({ email: "", password: "" });
      router.replace("/Admin");
    } catch (err) {
      setError(getApiErrorMessage(err, "invalid login attempt"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex bg-white text-black z-20 min-w-screen overflow-hidden min-h-screen font-sans">
      <div className="flex z-50 flex-col flex-1 min-w-0 bg-gray-200 min-h-screen items-center justify-center">
        <div className="flex flex-col p-18 max-w-[600px] rounded-2xl shadow-2xl shadow-gray-400 bg-blue-950 w-full gap-12">
          <div className="flex gap-5 w-full">
            <Link
              href="/"
              className="bg-blue-500 fixed top-5 right-20 text-white p-2 w-full max-w-[200px] bg-blue-950 font-bold rounded-2xl text-center"
            >
              Student login
            </Link>
            <img
              src="/3dwebsoft.jpeg"
              alt="3DWEBSOFT"
              className="w-full max-w-[150px] rounded-2xl"
            />
            <div className="flex flex-col gap-1 justify-center">
              <p className="text-3xl font-bold text-white">
                <span className="text-green-500">LMS</span>-Portal
              </p>
              <p className="text-white font-bold">Admin login page</p>
            </div>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-10">
            <div className="flex flex-col gap-2">
              <label className="font-bold text-white text-xl">Email</label>
              <input
                value={details.email}
                onChange={(e) =>
                  setDetails({ ...details, email: e.target.value })
                }
                type="email"
                placeholder="Type your email..."
                className="w-full border-1 border-white bg-white text-black p-2 rounded-2xl"
                autoComplete="email"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-white text-xl">Password</label>
              <input
                value={details.password}
                onChange={(e) =>
                  setDetails({ ...details, password: e.target.value })
                }
                type="password"
                placeholder="Type your password..."
                className="w-full border-1 border-white bg-white text-black p-2 rounded-2xl"
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="text-white font-bold bg-blue-500 hover:scale-105 cursor-pointer rounded-2xl p-2 disabled:opacity-70"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
            {error && (
              <p className="text-red-300 font-bold text-lg">{error}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
