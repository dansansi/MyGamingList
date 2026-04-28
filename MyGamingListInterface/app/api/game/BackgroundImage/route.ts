import { apiUrl } from "@/lib/api";

export async function GET() {
  const response = await fetch(`${apiUrl}/api/Game/background-image`);
  const text = await response.text();

  return new Response(text, {
    status: response.status,
    headers: { "Content-Type": "text/plain" },
  });
}
