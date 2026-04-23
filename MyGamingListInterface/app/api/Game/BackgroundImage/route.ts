import { API_URL } from "@/lib/api";

export async function GET() {
  const response = await fetch(`${API_URL}/api/Game/background-image`);

  return response;
}
