import { apiUrl } from "@/lib/api";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");

  if (!query) {
    return Response.json([]);
  }

  const response = await fetch(`${apiUrl}/rawgApi/Rawg/search?query=${query}&page=1`);

  const data = await response.json();

  return Response.json(data);
}
