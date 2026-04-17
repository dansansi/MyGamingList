"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token || !email) {
      router.replace("/forgot-password");
    }
  }, [token, email, router]);

  const passwordMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;
  const passwordTooShort = newPassword.length > 0 && newPassword.length < 8;

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("http://localhost:5195/api/Auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, newPassword }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const msg = data?.[0]?.description ?? "Não foi possível redefinir a senha.";
        setErrorMsg(msg);
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrorMsg("Algo deu errado. Tente novamente.");
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-white text-2xl font-bold tracking-tight">MyGamingList</h1>
          <p className="text-zinc-400 text-sm mt-1">Password creation</p>
        </div>

        <div className="bg-zinc-800 rounded-2xl p-8 shadow-xl">
          {status === "success" ? (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-zinc-700 flex items-center justify-center mx-auto">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-white text-lg font-semibold">Password created!</h2>
              <p className="text-zinc-400 text-sm">Your password was created successfully, you can log in now.</p>
              <Link
                href="/login"
                className="block mt-2 w-full bg-zinc-600 hover:bg-zinc-500 text-white font-medium rounded-lg py-2.5 text-sm text-center transition-colors"
              >
                Go to login
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-white text-lg font-semibold mb-1">New password</h2>
              <p className="text-zinc-400 text-sm mb-6">
                Choose a new password <span className="text-zinc-200">{email}</span>.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-zinc-300 text-sm mb-1.5">New password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="8 chars minimum."
                    className="w-full bg-zinc-700 text-white placeholder-zinc-400 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-zinc-500 transition"
                  />
                  {passwordTooShort && <p className="text-red-400 text-xs mt-1">Password have to be 8 chars or bigger.</p>}
                </div>

                <div>
                  <label className="block text-zinc-300 text-sm mb-1.5">Confirm password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your password"
                    className="w-full bg-zinc-700 text-white placeholder-zinc-400 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-zinc-500 transition"
                  />
                  {passwordMismatch && <p className="text-red-400 text-xs mt-1">Passwords mismatch.</p>}
                </div>

                {status === "error" && <p className="text-red-400 text-sm">{errorMsg}</p>}

                <button
                  type="submit"
                  disabled={status === "loading" || passwordMismatch || passwordTooShort}
                  className="w-full bg-zinc-600 hover:bg-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
                >
                  {status === "loading" ? "Salvando..." : "Redefinir senha"}
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
