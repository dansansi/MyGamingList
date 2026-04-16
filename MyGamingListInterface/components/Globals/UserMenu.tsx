"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function UserMenu({ username }: { username: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="flex items-center gap-4 text-zinc-300 hover:text-white text-sm">
        <span>👤</span>
        <span>{username}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-zinc-800 border border-zinc-700 rounded shadow-lg">
          <Link href="/profile" className="block px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-700">
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover-text-white hover:bg-zinc-700"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
