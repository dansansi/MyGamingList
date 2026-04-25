import { apiUrl } from "@/lib/api";

export async function GET() {
  const response = await fetch(`${apiUrl}/api/Game/background-image`);

  return response;
}
