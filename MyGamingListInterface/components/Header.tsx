import Link from "next/link";
import SearchBar from "./SearchBar";
import { cookies } from "next/headers";
import UserMenu from "./UserMenu";

export default async function Header() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const res = await fetch("http://localhost:5195/api/Auth/currentUser", {
    headers: {
      Cookie: `token=${token}`,
    },
  });

  const user = res.ok ? await res.json() : null;

  return (
    <header className="w-full h-16 bg-zinc-800 px-6 py-4 flex items-center justify-between">
      <span className="text-red-400 font-semibold text-xl">
        <Link href={"/"}>MyGamingList</Link>
      </span>
      <SearchBar />
      <nav>
        {user ? (
          <UserMenu username={user.username} />
        ) : (
          <Link href="/login" className="text-zinc-300 hover:text-white text-sm">
            Entrar
          </Link>
        )}
      </nav>
    </header>
  );
}
