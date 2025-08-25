import { NextResponse } from "next/server";

// GET /api/geocode?q=City&limit=5
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const limit = searchParams.get("limit") ?? "5";
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    // If q isn't provided but lat/lon are, use reverse geocoding
    if (!q && !(lat && lon)) {
      return NextResponse.json({ error: "Missing q or lat/lon" }, { status: 400 });
    }
    const apiKey = process.env.OWM_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Server missing OWM_API_KEY" }, { status: 500 });
    }

    let url: URL;
    if (q) {
      url = new URL("https://api.openweathermap.org/geo/1.0/direct");
      url.searchParams.set("q", q);
      url.searchParams.set("limit", limit);
      url.searchParams.set("appid", apiKey);
    } else {
      url = new URL("https://api.openweathermap.org/geo/1.0/reverse");
      url.searchParams.set("lat", lat!);
      url.searchParams.set("lon", lon!);
      url.searchParams.set("limit", limit);
      url.searchParams.set("appid", apiKey);
    }

    const resp = await fetch(url.toString());
    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json(
        { error: "OpenWeatherMap geocode error", details: text },
        { status: resp.status }
      );
    }
    const data = await resp.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Unknown error" }, { status: 500 });
  }
}
