import { NextRequest, NextResponse } from "next/server";
import { apiUrl } from "@/lib/api";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const response = await fetch(`${apiUrl}/api/Auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => null);
  return NextResponse.json(data, { status: response.status });
}
