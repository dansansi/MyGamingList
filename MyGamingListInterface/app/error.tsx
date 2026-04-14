"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center gap-4">
      <h1 className="text-white text-2xl font-bold">Algo deu errado</h1>
      <p className="text-zinc-400 text-sm">Estamos com problemas no momento. Tente novamente em instantes.</p>
      <button onClick={reset} className="bg-zinc-700 hover:bg-zinc-600 text-white text-sm px-4 py-2 rounded-md transition-colors">
        Tentar novamente
      </button>
    </div>
  );
}
