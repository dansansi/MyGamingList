"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgotPassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error();

      setStatus("sent");
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
          <p className="text-zinc-400 text-sm mt-1">Recuperação de senha</p>
        </div>

        <div className="bg-zinc-800 rounded-2xl p-8 shadow-xl">
          {status === "sent" ? (
            /* Estado de sucesso */
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-zinc-700 flex items-center justify-center mx-auto">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-white text-lg font-semibold">E-mail enviado!</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Se existe uma conta com <span className="text-zinc-200">{email}</span>, você receberá um link para redefinir sua
                senha em breve.
              </p>
              <p className="text-zinc-500 text-xs">Verifique também a caixa de spam.</p>
              <Link href="/login" className="block mt-4 text-zinc-300 hover:text-white text-sm transition-colors">
                ← Voltar para o login
              </Link>
            </div>
          ) : (
            /* Formulário */
            <>
              <h2 className="text-white text-lg font-semibold mb-1">Esqueceu sua senha?</h2>
              <p className="text-zinc-400 text-sm mb-6">Digite seu e-mail e enviaremos um link para redefinir sua senha.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-zinc-300 text-sm mb-1.5">E-mail</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full bg-zinc-700 text-white placeholder-zinc-400 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-zinc-500 transition"
                  />
                </div>

                {status === "error" && <p className="text-red-400 text-sm">{errorMsg}</p>}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-zinc-600 hover:bg-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
                >
                  {status === "loading" ? "Enviando..." : "Enviar link de recuperação"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/login" className="text-zinc-400 hover:text-zinc-300 text-sm transition-colors">
                  ← Voltar para o login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
