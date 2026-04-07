import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const body = await request.json();

  const response = await fetch("http://localhost:5195/api/UserGame", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return Response.json(data, { status: response.status });
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const res = await fetch(`http://localhost:5195/api/UserGame`, {
    headers: { Cookie: `token=${token}` },
    cache: "no-store",
  });

  if (!res.ok) return Response.json([], { status: res.status });
  const data = await res.json();
  return Response.json(data);
}
