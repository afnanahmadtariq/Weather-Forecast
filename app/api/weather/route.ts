import { NextResponse } from "next/server";

// GET /api/weather?lat=..&lon=..&units=metric
// Uses ONLY OpenWeatherMap free-tier endpoints: /data/2.5/weather and /data/2.5/forecast
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const units = searchParams.get("units") ?? "metric";
    const lang = searchParams.get("lang") ?? "en";

    if (!lat || !lon) {
      return NextResponse.json({ error: "Missing lat/lon" }, { status: 400 });
    }

    const apiKey = process.env.OWM_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Server missing OWM_API_KEY" }, { status: 500 });
    }

    // Build URLs for free-tier endpoints
    const currentUrl = new URL("https://api.openweathermap.org/data/2.5/weather");
    currentUrl.searchParams.set("lat", lat);
    currentUrl.searchParams.set("lon", lon);
    currentUrl.searchParams.set("units", units);
    currentUrl.searchParams.set("lang", lang);
    currentUrl.searchParams.set("appid", apiKey);

    const forecastUrl = new URL("https://api.openweathermap.org/data/2.5/forecast");
    forecastUrl.searchParams.set("lat", lat);
    forecastUrl.searchParams.set("lon", lon);
    forecastUrl.searchParams.set("units", units);
    forecastUrl.searchParams.set("lang", lang);
    forecastUrl.searchParams.set("appid", apiKey);

    // Prepare Open-Meteo URL for UV Index (free)
    const omUrl = new URL("https://api.open-meteo.com/v1/forecast");
    omUrl.searchParams.set("latitude", lat);
    omUrl.searchParams.set("longitude", lon);
    // Request both current and hourly UV index to be safe
    omUrl.searchParams.set("current", "uv_index");
    omUrl.searchParams.set("hourly", "uv_index");
    omUrl.searchParams.set("timezone", "auto");

    // Fetch in parallel (do not fail overall if Open-Meteo fails)
    const [curResp, fcResp, omResp] = await Promise.all([
      fetch(currentUrl.toString()),
      fetch(forecastUrl.toString()),
      fetch(omUrl.toString()).catch(() => null),
    ]);

    if (!curResp.ok) {
      const text = await curResp.text();
      return NextResponse.json(
        { error: "OpenWeatherMap /weather error", details: text },
        { status: curResp.status }
      );
    }
    if (!fcResp.ok) {
      const text = await fcResp.text();
      return NextResponse.json(
        { error: "OpenWeatherMap /forecast error", details: text },
        { status: fcResp.status }
      );
    }

    const current = await curResp.json();
    const forecast = await fcResp.json();
    let uvIndex: number | undefined = undefined;
    try {
      if (omResp && (omResp as Response).ok) {
        const om = await (omResp as Response).json();
        // Prefer current.uv_index if available
        if (om?.current?.uv_index != null) {
          uvIndex = Number(om.current.uv_index);
        } else if (Array.isArray(om?.hourly?.uv_index) && Array.isArray(om?.hourly?.time)) {
          // Fallback: pick nearest hour to now
          const times: string[] = om.hourly.time;
          const values: number[] = om.hourly.uv_index;
          let bestIdx = 0;
          let bestDiff = Number.POSITIVE_INFINITY;
          const now = Date.now();
          for (let i = 0; i < times.length; i++) {
            const t = Date.parse(times[i]);
            const diff = Math.abs(t - now);
            if (diff < bestDiff) {
              bestDiff = diff;
              bestIdx = i;
            }
          }
          uvIndex = Number(values[bestIdx]);
        }
      }
    } catch {}

    // Derive timezone offset (seconds) from either response
    const tzOffset: number = forecast?.city?.timezone ?? current?.timezone ?? 0;

    // Map current
    const mappedCurrent = {
      dt: current.dt,
      sunrise: current.sys?.sunrise,
      sunset: current.sys?.sunset,
      temp: current.main?.temp,
      feels_like: current.main?.feels_like,
      pressure: current.main?.pressure,
      humidity: current.main?.humidity,
      uvi: uvIndex,
      clouds: current.clouds?.all,
      visibility: current.visibility,
      wind_speed: current.wind?.speed,
      weather: Array.isArray(current.weather) ? current.weather : [],
    };

    // Map hourly from forecast list (3-hour steps). Limit to ~48 hours to mimic One Call.
    const hourly = Array.isArray(forecast.list)
      ? forecast.list.slice(0, 16).map((h: any) => ({
          dt: h.dt,
          temp: h.main?.temp,
          pop: h.pop,
          wind_speed: h.wind?.speed,
          humidity: h.main?.humidity,
          visibility: h.visibility,
          weather: Array.isArray(h.weather) ? h.weather : [],
        }))
      : [];

    // Aggregate to daily: group forecast items by local date using tzOffset
    const groups: Record<string, any[]> = {};
    if (Array.isArray(forecast.list)) {
      for (const it of forecast.list) {
        const localMs = (it.dt + tzOffset) * 1000;
        const d = new Date(localMs);
        const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
        (groups[key] ||= []).push(it);
      }
    }

  const daily = Object.values(groups)
      .slice(0, 7)
      .map((items: any[]) => {
        // Choose representative weather around midday if possible, else first
        const byHour = items.map((i) => ({
          hour: new Date((i.dt + tzOffset) * 1000).getUTCHours(),
          item: i,
        }));
        let rep = byHour.find((x) => x.hour === 12)?.item ?? items[Math.floor(items.length / 2)];
  const temps = items.map((i) => ({ min: i.main?.temp_min, max: i.main?.temp_max }));
  const mins = temps.map((t) => t.min).filter((v) => typeof v === "number") as number[];
  const maxs = temps.map((t) => t.max).filter((v) => typeof v === "number") as number[];
  let min = mins.length ? Math.min(...mins) : rep.main?.temp;
  let max = maxs.length ? Math.max(...maxs) : rep.main?.temp;
        // Compute average pop for the day (best-effort)
        const popVals = items.map((i) => i.pop).filter((v) => typeof v === "number");
        const pop = popVals.length ? popVals.reduce((a: number, b: number) => a + b, 0) / popVals.length : undefined;

        return {
          dt: rep.dt,
          sunrise: undefined,
          sunset: undefined,
          temp: { min, max },
          pop,
          weather: Array.isArray(rep.weather) ? rep.weather : [],
        };
      });

    const result = {
      timezone_offset: tzOffset,
      current: mappedCurrent,
      hourly,
      daily,
    };

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Unknown error" }, { status: 500 });
  }
}
