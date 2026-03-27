"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Game } from "@/types/game";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${query}`);
        const data = await response.json();
        setResults(data.slice(0, 5));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function clickOutsideHandler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setQuery("");
      }
    }
    document.addEventListener("mousedown", clickOutsideHandler);
    return () => document.removeEventListener("mousedown", clickOutsideHandler);
  }, []);

  useEffect(() => {
    setQuery("");
  }, [pathname]);

  return (
    <div ref={ref} className="relative w-full max-w-xl">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Busque seus jogos aqui..."
        className="w-full bg-zinc-700 text-white placeholder-zinc-400 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-zinc-500"
      />

      {results.length > 0 && (
        <ul className="absolute top-full mt-1 w-full bg-zinc-800 rounded-lg overflow-hidden z-10">
          {results.map((game) => (
            <li key={game.id}>
              <Link
                href={`/games/${game.id}`}
                className="flex items-center gap-3 px-4 py-2 hover:bg-zinc-700 text-sm text-zinc-200"
              >
                {game.backgroundImage && (
                  <Image
                    src={game.backgroundImage}
                    alt={`Foto do jogo ${game.name}`}
                    className="w-10 h-10 object-cover rounded"
                  />
                )}
                {game.name}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {isLoading && (
        <div className="absolute top-full mt-1 w-full bg-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-400">Buscando...</div>
      )}
    </div>
  );
}
