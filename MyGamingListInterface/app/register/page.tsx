"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const passwordRules = {
    maiuscula: /[A-Z]/.test(password),
    minuscula: /[a-z]/.test(password),
    especial: /[^a-zA-Z0-9]/.test(password),
    numero: /[0-9]/.test(password),
    minimo: password.length >= 8,
  };

  async function handleSubmit() {
    setError("");

    const response = await fetch("api/auth/register", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ userName, email, password }),
    });

    if (!response.ok) {
      setError("Erro ao criar usuario");
      return;
    }
    const redirect = searchParams.get("redirect") || "/";
    router.push(redirect);
  }
  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="bg-zinc-800 p-8 rounded-xl w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-white text-2xl font-semibold">Cadastro</h1>

        <input
          type="text"
          placeholder="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="bg-zinc-700 text-white placeholder-zinc-400 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-zinc-500"
        />

        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-zinc-700 text-white placeholder-zinc-400 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-zinc-500"
        />

        <div className="w-full">
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-zinc-700 text-white placeholder-zinc-400 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-zinc-500 w-full"
          />

          <p className={`text-xs mt-1 ${passwordRules.maiuscula ? "text-green-400" : "text-zinc-500"}`}>1 maiúscula</p>
          <p className={`text-xs mt-1 ${passwordRules.minuscula ? "text-green-400" : "text-zinc-500"}`}>1 minúscula</p>
          <p className={`text-xs mt-1 ${passwordRules.especial ? "text-green-400" : "text-zinc-500"}`}>1 caracter especial</p>
          <p className={`text-xs mt-1 ${passwordRules.numero ? "text-green-400" : "text-zinc-500"}`}>1 número</p>
          <p className={`text-xs mt-1 ${passwordRules.minimo ? "text-green-400" : "text-zinc-500"}`}>Minimo 8 digitos</p>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          onClick={handleSubmit}
          className="bg-zinc-600 hover:bg-zinc-500 text-white rounded-lg px-4 py-2 font-medium transition-colors"
        >
          Criar conta
        </button>

        <p className="text-zinc-400 text-sm text-center">
          Já tem conta?{" "}
          <Link href="/login" className="text-white hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
