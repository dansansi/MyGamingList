export async function GET() {
  const res = await fetch("http://localhost:5195/api/HomeGames/random-games", {
    cache: "no-store",
  });

  if (!res.ok) return Response.json([], { status: res.status });

  const data = await res.json();
  return Response.json(data);
}
