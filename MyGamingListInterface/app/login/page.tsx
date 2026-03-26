"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    async function getBackgroundImage() {
      const res = await fetch("/api/Game/BackgroundImage");
      const img = await res.text();
      setBgImage(img.trim());
    }
    getBackgroundImage();
  }, []);

  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleSubmit() {
    setError("");

    const response = await fetch("api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, password }),
    });

    if (!response.ok) {
      setError("Login ou senha invalidos");
      return;
    }
    const redirect = searchParams.get("redirect") || "/";
    router.push(redirect);
  }

  return (
    <main
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: bgImage ? `url(${bgImage})` : undefined }}
    >
      <div className="bg-zinc-800 p-8 rounded-xl w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-white text-2xl font-semibold">Entrar</h1>

        <input
          type="login"
          placeholder="Username ou Email"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          className="bg-zinc-700 text-white placeholder-zinc-400 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-zinc-500"
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-zinc-700 text-white placeholder-zinc-400 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-zinc-500"
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          onClick={handleSubmit}
          className="bg-zinc-600 hover:bg-zinc-500 text-white rounded-lg px-4 py-2 font-medium transition-colors"
        >
          Logar
        </button>

        <p className="text-zinc-400 text-sm text-center">
          Não tem conta?{" "}
          <Link href="/register" className="text-white hover:underline">
            Cadastre-se
          </Link>
        </p>
        <Link href={"/forgot-password"}>
          <p className="text-white text-sm flex justify-center">Esqueceu a senha?</p>
        </Link>
      </div>
    </main>
  );
}
