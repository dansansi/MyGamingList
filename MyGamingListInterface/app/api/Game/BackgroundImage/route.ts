export async function GET() {
  const response = await fetch("http://localhost:5195/api/Game/BackgroundImage");

  return response;
}
