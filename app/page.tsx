"use client"

import { useEffect, useMemo, useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  WiThermometer,
  WiHumidity,
  WiStrongWind,
  WiDayHaze,
  WiBarometer,
  WiSunset,
  WiDayFog,
} from "weather-icons-react"
import { formatLocalTime, formatDayName, isNightFromIconCode, mapOwmToIcon } from "@/lib/weather"
import { toast } from "@/hooks/use-toast"

type OwmWeather = {
  id: number
  main: string
  description: string
  icon: string
}

type OwmCurrent = {
  dt: number
  sunrise?: number
  sunset?: number
  temp: number
  feels_like: number
  pressure: number
  humidity: number
  uvi?: number
  clouds?: number
  visibility?: number
  wind_speed: number
  weather: OwmWeather[]
}

type OwmHourly = {
  dt: number
  temp: number
  pop?: number
  wind_speed?: number
  humidity?: number
  visibility?: number
  weather: OwmWeather[]
}

type OwmDaily = {
  dt: number
  sunrise?: number
  sunset?: number
  temp: { min: number; max: number }
  pop?: number
  weather: OwmWeather[]
}

type OwmOneCall = {
  timezone_offset: number
  current: OwmCurrent
  hourly: OwmHourly[]
  daily: OwmDaily[]
}

export default function WeatherApp() {
  const [showMoreConditions, setShowMoreConditions] = useState(false)

  // Simple search + coordinates state. Default to Madrid, ES
  const [query, setQuery] = useState("")
  const [city, setCity] = useState("Madrid, ES")
  const [coords, setCoords] = useState<{ lat: number; lon: number }>({ lat: 40.4168, lon: -3.7038 })
  const [data, setData] = useState<OwmOneCall | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // On first mount: try cookie, else geolocate, else default
  useEffect(() => {
    // Try cookie first
    try {
      const raw = document.cookie.split("; ").find((c) => c.startsWith("wf_geo="))?.split("=")[1]
      if (raw) {
        const decoded = decodeURIComponent(raw)
        const parsed = JSON.parse(decoded) as { lat?: number; lon?: number; city?: string }
        if (typeof parsed.lat === "number" && typeof parsed.lon === "number") {
          setCoords({ lat: parsed.lat, lon: parsed.lon })
          if (parsed.city) setCity(parsed.city)
          return
        }
      }
    } catch {}

    // Fallback to geolocation
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords
          setCoords({ lat: latitude, lon: longitude })
          try {
            // Reverse geocode for city label (best-effort) - API will also set cookie
            const res = await fetch(`/api/geocode?lat=${latitude}&lon=${longitude}&limit=1`)
            if (res.ok) {
              const [place] = (await res.json()) as Array<{ name: string; state?: string; country?: string }>
              if (place) setCity(`${place.name}${place.state ? ", " + place.state : ""}${place.country ? ", " + place.country : ""}`)
            }
          } catch {}
        },
        () => {
          // Non-blocking toast if denied; keep defaults
          toast({ title: "Location permission denied", description: "Using Madrid by default." })
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      )
    }
  }, [])

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true)
        setError(null)
        const url = `/api/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric`
        const res = await fetch(url)
        if (!res.ok) throw new Error(`Weather fetch failed: ${res.status}`)
        const json: OwmOneCall = await res.json()
        setData(json)
      } catch (e: any) {
        setError(e?.message ?? "Failed to load weather")
        toast({ title: "Failed to load weather", description: e?.message ?? "Unknown error" })
        setData(null)
      } finally {
        setLoading(false)
      }
    }
    fetchWeather()
  }, [coords.lat, coords.lon])

  async function handleSearch() {
    const q = query.trim()
    if (!q) return
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}&limit=1`)
      if (!res.ok) throw new Error(`Geocode failed: ${res.status}`)
      const arr: Array<{ name: string; country?: string; state?: string; lat: number; lon: number }> = await res.json()
      if (!arr?.length) {
        setError("No matching city")
        return
      }
      const top = arr[0]
      setCity(`${top.name}${top.state ? ", " + top.state : ""}${top.country ? ", " + top.country : ""}`)
      setCoords({ lat: top.lat, lon: top.lon })
  // Cookie is set by API; nothing else to do here
    } catch (e: any) {
      setError(e?.message ?? "Search error")
      toast({ title: "Search error", description: e?.message ?? "Unknown error" })
    } finally {
      setLoading(false)
    }
  }

  const chanceOfRainToday = useMemo(() => {
    if (!data?.hourly?.length) return 0
    // Take next 6 hours and compute max pop
    const pops = data.hourly.slice(0, 6).map((h) => (h.pop ?? 0))
    return Math.round(Math.max(...pops) * 100)
  }, [data])

  const hourlySample = useMemo(() => {
    if (!data?.hourly?.length) return [] as OwmHourly[]
    // Pick 6 slots across the day roughly every ~3 hours starting from next hour
    const picked: OwmHourly[] = []
    for (let i = 1; i < Math.min(data.hourly.length, 20) && picked.length < 6; i += 3) {
      picked.push(data.hourly[i])
    }
    return picked
  }, [data])

  const tz = data?.timezone_offset ?? 0
  const current = data?.current
  const currentWeather = current?.weather?.[0]
  const isNight = isNightFromIconCode(currentWeather?.icon)
  const currentIcon = currentWeather ? mapOwmToIcon(currentWeather.id, isNight) : "/weather/windy.png"

  return (
    <div className="mx-auto flex gap-6">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-0 rounded-2xl [mask-image:radial-gradient(80%_60%_at_50%_0%,black,transparent)] bg-white/5"></div>
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/[0.6]" />
          <div className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search for cities"
              className="flex-1 backdrop-blur-xs bg-white/5 shadow-lg border-white/20 pl-12 h-12 text-white placeholder:text-white/[0.8]"
            />
            <Button onClick={handleSearch} className="h-12">Search</Button>
          </div>
          {error && <div className="mt-2 text-sm text-red-300">{error}</div>}
        </div>

        {/* Current Weather */}
  <div className="backdrop-blur-xs bg-white/5 shadow-lg rounded-2xl p-8">
          <div className="pointer-events-none absolute inset-0 rounded-2xl [mask-image:radial-gradient(80%_60%_at_50%_0%,black,transparent)] bg-white/5"></div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-light mb-2">{city}</h1>
              <p className="text-white/[0.6] mb-8">Chance of rain: {chanceOfRainToday}%</p>
              <div className="text-8xl font-light">{loading || !current ? (<span className="inline-block w-24 h-16 bg-white/10 rounded animate-pulse" />) : Math.round(current.temp) + "°"}</div>
            </div>
            <div className="relative">
              {loading ? (
                <div className="w-32 h-32 bg-white/10 rounded-xl animate-pulse" />
              ) : (
                <img src={currentIcon} alt={currentWeather?.description ?? "Weather"} className="w-auto h-32" />
              )}
            </div>
          </div>
        </div>

        {/* Today's Forecast */}
        <div className="backdrop-blur-xs bg-white/5 shadow-lg rounded-2xl p-6">
          <div className="pointer-events-none absolute inset-0 rounded-2xl [mask-image:radial-gradient(80%_60%_at_50%_0%,black,transparent)] bg-white/5"></div>
          <h3 className="text-white/[0.6] text-sm font-medium mb-6 uppercase tracking-wider">Today's Forecast</h3>
          <div className="grid grid-cols-6 gap-4">
            {(loading && !data ? Array.from({ length: 6 }) : hourlySample).map((h: any, idx: number) => {
              if (!h) {
                return (
                  <div key={idx} className="text-center">
                    <p className="text-white/[0.6] text-sm mb-4">--:--</p>
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 bg-white/10 rounded-lg animate-pulse" />
                    </div>
                    <p className="text-white font-medium">--°</p>
                  </div>
                )
              }
              const w = h.weather?.[0]
              const night = isNightFromIconCode(w?.icon)
              const icon = w ? mapOwmToIcon(w.id, night) : "/weather/windy.png"
              return (
                <div key={idx} className="text-center">
                  <p className="text-white/[0.6] text-sm mb-4">{formatLocalTime(h.dt, tz)}</p>
                  <div className="flex justify-center mb-4">
                    <img src={icon} alt={w?.description ?? "Forecast"} className="w-12 h-auto" />
                  </div>
                  <p className="text-white font-medium">{Math.round(h.temp)}°</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Air Conditions */}
        <div className="backdrop-blur-xs bg-white/5 shadow-lg rounded-2xl p-6">
          <div className="pointer-events-none absolute inset-0 rounded-2xl [mask-image:radial-gradient(80%_60%_at_50%_0%,black,transparent)] bg-white/5"></div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white/[0.6] text-sm font-medium uppercase tracking-wider">Air Conditions</h3>
            <Button
              variant="outline"
              size="sm"
              className="bg-blue-500 border-blue-500 text-white hover:bg-blue-600"
              onClick={() => setShowMoreConditions(!showMoreConditions)}
            >
              {showMoreConditions ? "See less" : "See more"}
            </Button>
          </div>
          <div className={`grid gap-4 ${showMoreConditions ? "grid-cols-4" : "grid-cols-2"}`}>
            {showMoreConditions ? (
              // Expanded view with 8 cards
              <>
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <WiDayHaze size={20} color="#94a3b8" />
                    <p className="text-white/[0.6] text-sm uppercase tracking-wide">UV Index</p>
                  </div>
                  <p className="text-3xl font-light">{loading ? <span className="inline-block w-10 h-8 bg-white/10 rounded animate-pulse" /> : (current?.uvi ?? "-")}</p>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <WiStrongWind size={20} color="#94a3b8" />
                    <p className="text-white/[0.6] text-sm uppercase tracking-wide">Wind</p>
                  </div>
                  <p className="text-3xl font-light">{loading ? <span className="inline-block w-20 h-8 bg-white/10 rounded animate-pulse" /> : (current ? `${Math.round(current.wind_speed * 3.6)} km/h` : "-")}</p>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <WiHumidity size={20} color="#94a3b8" />
                    <p className="text-white/[0.6] text-sm uppercase tracking-wide">Humidity</p>
                  </div>
                  <p className="text-3xl font-light">{loading ? <span className="inline-block w-14 h-8 bg-white/10 rounded animate-pulse" /> : (current ? `${current.humidity}%` : "-")}</p>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <WiDayFog size={20} color="#94a3b8" />
                    <p className="text-white/[0.6] text-sm uppercase tracking-wide">Visibility</p>
                  </div>
                  <p className="text-3xl font-light">{loading ? <span className="inline-block w-14 h-8 bg-white/10 rounded animate-pulse" /> : (current?.visibility != null ? `${Math.round(current.visibility / 1000)} km` : "-")}</p>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <WiThermometer size={20} color="#94a3b8" />
                    <p className="text-white/[0.6] text-sm uppercase tracking-wide">Feels Like</p>
                  </div>
                  <p className="text-3xl font-light">{loading ? <span className="inline-block w-12 h-8 bg-white/10 rounded animate-pulse" /> : (current ? `${Math.round(current.feels_like)}°` : "-")}</p>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <WiHumidity size={20} color="#94a3b8" />
                    <p className="text-white/[0.6] text-sm uppercase tracking-wide">Chance of Rain</p>
                  </div>
                  <p className="text-3xl font-light">{loading ? <span className="inline-block w-10 h-8 bg-white/10 rounded animate-pulse" /> : `${chanceOfRainToday}%`}</p>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <WiBarometer size={20} color="#94a3b8" />
                    <p className="text-white/[0.6] text-sm uppercase tracking-wide">Pressure</p>
                  </div>
                  <p className="text-3xl font-light">{loading ? <span className="inline-block w-16 h-8 bg-white/10 rounded animate-pulse" /> : (current ? `${current.pressure} hPa` : "-")}</p>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <WiSunset size={20} color="#94a3b8" />
                    <p className="text-white/[0.6] text-sm uppercase tracking-wide">Sunset</p>
                  </div>
                  <p className="text-3xl font-light">{loading ? <span className="inline-block w-16 h-8 bg-white/10 rounded animate-pulse" /> : (data && (data.daily?.[0]?.sunset || current?.sunset) ? formatLocalTime((data.daily?.[0]?.sunset || current?.sunset)!, tz, { hour: "2-digit", minute: "2-digit" }) : "-")}</p>
                </div>
              </>
            ) : (
              // Original collapsed view with 4 items
              <>
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <WiThermometer size={20} color="#94a3b8" />
                    <div>
                      <p className="text-white/[0.6] text-sm">Real Feel</p>
            <p className="text-2xl font-light">{current ? `${Math.round(current.feels_like)}°` : "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <WiHumidity size={20} color="#94a3b8" />
                    <div>
                      <p className="text-white/[0.6] text-sm">Chance of rain</p>
            <p className="text-2xl font-light">{chanceOfRainToday}%</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <WiStrongWind size={20} color="#94a3b8" />
                    <div>
                      <p className="text-white/[0.6] text-sm">Wind</p>
            <p className="text-2xl font-light">{current ? `${Math.round(current.wind_speed * 3.6)} km/h` : "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <WiDayHaze size={20} color="#94a3b8" />
                    <div>
                      <p className="text-white/[0.6] text-sm">UV Index</p>
            <p className="text-2xl font-light">{current?.uvi ?? "-"}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - 7-Day Forecast */}
      <div className="w-80 backdrop-blur-xs bg-white/5 shadow-lg rounded-2xl p-6">
        <div className="pointer-events-none absolute inset-0 rounded-2xl [mask-image:radial-gradient(80%_60%_at_50%_0%,black,transparent)] bg-white/5"></div>
        <h3 className="text-white/[0.6] text-sm font-medium mb-6 uppercase tracking-wider">7-Day Forecast</h3>
        <div className="space-y-4">
          {data?.daily?.slice(0, 7).map((d, idx) => {
            const w = d.weather?.[0]
            const icon = w ? mapOwmToIcon(w.id, false) : "/weather/windy.png"
            return (
              <div key={idx} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-4">
                  <div className="w-12 text-white/[0.6] text-sm">{formatDayName(d.dt, tz)}</div>
                  <div className="w-8 h-auto flex items-center justify-center">
                    <img src={icon} alt={w?.description ?? "Forecast"} className="w-8 h-auto" />
                  </div>
                  <div className="text-white capitalize">{w?.description ?? "-"}</div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-white">{Math.round(d.temp.max)}</span>
                  <span className="text-white/[0.6]">/{Math.round(d.temp.min)}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
