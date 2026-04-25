import { API_URL } from "@/lib/api";

export async function GET(request: Request, { params }: { params: Promise<{ externalId: string }> }) {
  const { externalId } = await params;

  const res = await fetch(`${API_URL}/api/Game/ensure/${externalId}`);

  return new Response(null, { status: res.status });
}
