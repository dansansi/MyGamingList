/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { API_URL } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch(`${API_URL}/api/Auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error();

      setStatus("sent");
    } catch {
      setErrorMsg("Something's wrong, try again later.");
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-zinc-400 text- mt-1">Password recovery</p>
        </div>

        <div className="bg-zinc-800 rounded-2xl p-8 shadow-xl">
          {status === "sent" ? (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-zinc-700 flex items-center justify-center mx-auto">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-white text-lg font-semibold">E-mail sent!</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                If there is an account with <span className="text-zinc-200">{email}</span>, you will get a link to redefine your
                password.
              </p>
              <p className="text-red-600 text-xs">Check the spam folder too.</p>
              <Link href="/login" className="block mt-4 text-zinc-300 hover:text-white text-sm transition-colors">
                ← Voltar para o login
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-white text-lg font-semibold mb-1">Forgot your password?</h2>
              <p className="text-zinc-400 text-sm mb-6">Write down your e-mail and we'll send you a link to recover it.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-zinc-300 text-sm mb-1.5">E-mail</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-zinc-700 text-white placeholder-zinc-400 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-zinc-500 transition"
                  />
                </div>

                {status === "error" && <p className="text-red-400 text-sm">{errorMsg}</p>}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-zinc-600 hover:bg-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
                >
                  {status === "loading" ? "Sending..." : "Send recovery link"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/login" className="text-zinc-400 hover:text-zinc-300 text-sm transition-colors">
                  ← Go back to login page
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
