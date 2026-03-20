import Link from "next/link";
import SearchBar from "./SearchBar";

export default function Header() {
  return (
    <header className="w-full bg-zinc-800 px-6 py-4 flex items-center justify-between">
      <span className="text-white font-semibold text-xl">
        <Link href={"/"}>MyGamingList</Link>
      </span>
      <SearchBar></SearchBar>
      <nav>
        <Link href="/login" className="text-zinc-300 hover:text-white text-sm">
          Entrar
        </Link>
      </nav>
    </header>
  );
}