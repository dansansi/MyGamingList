import ProfileSidebar from "@/components/ProfilePage/ProfileSidebar";
import StatusCards from "@/components/ProfilePage/StatusCards";
import { API_URL } from "@/lib/api";
import { cookies } from "next/headers";

async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const res = await fetch(`${API_URL}/api/Auth/current-user`, {
    headers: { Cookie: `token=${token}` },
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

async function getUserGames() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const res = await fetch(`${API_URL}/api/UserGame`, {
    headers: { Cookie: `token=${token}` },
    cache: "no-store",
  });

  if (!res.ok) return [];
  return res.json();
}

export default async function ProfilePage() {
  const [user, games] = await Promise.all([getCurrentUser(), getUserGames()]);

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-zinc-900 text-white">
      <ProfileSidebar user={user} games={games} />
      <main className="flex-1 p-8">
        <StatusCards games={games} />
      </main>
    </div>
  );
}
