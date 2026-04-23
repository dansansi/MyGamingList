import { API_URL } from "@/lib/api";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const body = await request.json();

  const response = await fetch(`${API_URL}/api/UserGame`, {
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

  const res = await fetch(`${API_URL}/api/UserGame`, {
    headers: { Cookie: `token=${token}` },
    cache: "no-store",
  });

  if (!res.ok) return Response.json([], { status: res.status });
  const data = await res.json();
  return Response.json(data);
}

export async function DELETE(request: Request, { params }: { params: { externalId: string } }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const { externalId } = params;

  console.log("DELETE chamado, externalId:", externalId);
  console.log("token:", token);

  const res = await fetch(`${API_URL}/api/UserGame/${externalId}`, {
    method: "DELETE",
    headers: { Cookie: `token=${token}` },
  });
  console.log("status do backend:", res.status);
  return new Response(null, { status: res.status });
}
