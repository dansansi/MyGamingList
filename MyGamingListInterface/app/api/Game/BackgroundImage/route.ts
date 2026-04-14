export async function GET() {
  const response = await fetch("http://localhost:5195/api/Game/background-image");

  return response;
}
