import { API_URL } from "@/lib/api";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    return Response.json({ error: "Credenciais inválidas" }, { status: 401 });
  }
  const { token } = await response.json();

  const res = Response.json({ success: true });
  res.headers.set("Set-Cookie", `token=${token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=604800`);

  return res;
}
