import { API_URL } from "@/lib/api";
import { cookies } from "next/headers";

export async function DELETE(request: Request, { params }: { params: { externalId: string } }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const { externalId } = await params;

  console.log("DELETE chamado, externalId:", externalId);
  console.log("token:", token);

  const res = await fetch(`${API_URL}/api/UserGame/${externalId}`, {
    method: "DELETE",
    headers: { Cookie: `token=${token}` },
  });
  console.log("status do backend:", res.status);
  return new Response(null, { status: res.status });
}
