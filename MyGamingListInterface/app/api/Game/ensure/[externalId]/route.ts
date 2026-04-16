export async function GET(request: Request, { params }: { params: { externalId: string } }) {
  const { externalId } = await params;

  const res = await fetch(`http://localhost:5195/api/Game/ensure/${externalId}`);

  return new Response(null, { status: res.status });
}
