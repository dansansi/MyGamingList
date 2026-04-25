import { API_URL } from "@/lib/api";
import { cookies } from "next/headers";

export async function DELETE(request: Request, { params }: { params: Promise<{ externalId: string }> }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const { externalId } = await params;

  const res = await fetch(`${API_URL}/api/UserGame/${externalId}`, {
    method: "DELETE",
    headers: { Cookie: `token=${token}` },
  });
  return new Response(null, { status: res.status });
}
