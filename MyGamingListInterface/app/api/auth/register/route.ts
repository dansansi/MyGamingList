import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const response = await fetch("http://localhost:5195/api/auth/register", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    return Response.json({ error: "Erro ao registrar" }, { status: 400 });
  }

  const res = Response.json({ success: true });
  return res;
}
