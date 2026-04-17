/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = document.cookie.split("; ").find((row) => row.startsWith("cookie_consent="));
    if (!consent) setVisible(true);
  }, []);

  function handleAccept() {
    document.cookie = "cookie_consent=true; Path=/; Max-Age=31536000; SameSite=Strict";
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-800 border-t border-zinc-700 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-zinc-300 text-sm text-center sm:text-left">
        This site uses cookies to keep you logged in and save your preferences. By using the site, you agree to our use of
        cookies.
      </p>
      <button
        onClick={handleAccept}
        className="bg-zinc-600 hover:bg-zinc-500 text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors whitespace-nowrap"
      >
        Accept
      </button>
    </div>
  );
}
