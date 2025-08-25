"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/search-bar"
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
import { useWeather } from "@/components/weather-provider"

import type { OwmOneCall, OwmHourly } from "@/components/weather-provider"

export default function WeatherApp() {
  const [showMoreConditions, setShowMoreConditions] = useState(false)
  const { city, data, loading, units, timeFormat12h } = useWeather()

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
      <div className="flex-1 space-y-6 mr-86">
        <SearchBar />

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
                <p className="text-white/[0.6] text-sm mb-4">{formatLocalTime(h.dt, tz, { hour12: timeFormat12h })}</p>
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
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer p-5"
              onClick={() => setShowMoreConditions(!showMoreConditions)}
            >
              {showMoreConditions ? "See less" : "See more"}
            </Button>
          </div>
          <div className={`grid gap-4 ${showMoreConditions ? "grid-cols-4" : "grid-cols-2"}`}>
            {showMoreConditions ? (
              // Expanded view with 8 cards
              <>
                <div className="backdrop-blur-xs bg-white/5 shadow-lg  rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <WiDayHaze size={20} color="#94a3b8" />
                    <p className="text-white/[0.6] text-sm uppercase tracking-wide">UV Index</p>
                  </div>
                  <p className="text-3xl font-light">{loading ? <span className="inline-block w-10 h-8 bg-white/10 rounded animate-pulse" /> : (current?.uvi ?? "-")}</p>
                </div>
                <div className="backdrop-blur-xs bg-white/5 shadow-lg  rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <WiStrongWind size={20} color="#94a3b8" />
                    <p className="text-white/[0.6] text-sm uppercase tracking-wide">Wind</p>
                  </div>
                  <p className="text-3xl font-light">
                    {loading ? (
                      <span className="inline-block w-20 h-8 bg-white/10 rounded animate-pulse" />
                    ) : current ? (
                      (() => {
                        // Normalize to m/s from OWM (metric: m/s, imperial: mph)
                        const baseMs = data ? (units.temperature === "fahrenheit" ? (current.wind_speed ?? 0) * 0.44704 : (current.wind_speed ?? 0)) : 0
                        const { windSpeed } = units
                        if (windSpeed === "kmh") {
                          const v = Math.round(baseMs * 3.6)
                          return `${v} km/h`
                        } else if (windSpeed === "ms") {
                          const v = Math.round(baseMs)
                          return `${v} m/s`
                        } else {
                          const v = Math.round(baseMs * 1.943844)
                          return `${v} knots`
                        }
                      })()
                    ) : (
                      "-"
                    )}
                  </p>
                </div>
                <div className="backdrop-blur-xs bg-white/5 shadow-lg rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <WiHumidity size={20} color="#94a3b8" />
                    <p className="text-white/[0.6] text-sm uppercase tracking-wide">Humidity</p>
                  </div>
                  <p className="text-3xl font-light">{loading ? <span className="inline-block w-14 h-8 bg-white/10 rounded animate-pulse" /> : (current ? `${current.humidity}%` : "-")}</p>
                </div>
                <div className="backdrop-blur-xs bg-white/5 shadow-lg rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <WiDayFog size={20} color="#94a3b8" />
                    <p className="text-white/[0.6] text-sm uppercase tracking-wide">Visibility</p>
                  </div>
                  <p className="text-3xl font-light">
                    {loading ? (
                      <span className="inline-block w-14 h-8 bg-white/10 rounded animate-pulse" />
                    ) : current?.visibility != null ? (
                      (() => {
                        const meters = current.visibility
                        if (units.distance === "kilometers") {
                          return `${Math.round(meters / 1000)} km`
                        } else {
                          const miles = meters / 1609.344
                          return `${Math.round(miles)} mi`
                        }
                      })()
                    ) : (
                      "-"
                    )}
                  </p>
                </div>
                <div className="backdrop-blur-xs bg-white/5 shadow-lg rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <WiThermometer size={20} color="#94a3b8" />
                    <p className="text-white/[0.6] text-sm uppercase tracking-wide">Feels Like</p>
                  </div>
                  <p className="text-3xl font-light">{loading ? <span className="inline-block w-12 h-8 bg-white/10 rounded animate-pulse" /> : (current ? `${Math.round(current.feels_like)}°` : "-")}</p>
                </div>
                <div className="backdrop-blur-xs bg-white/5 shadow-lg rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <WiHumidity size={20} color="#94a3b8" />
                    <p className="text-white/[0.6] text-sm uppercase tracking-wide">Chance of Rain</p>
                  </div>
                  <p className="text-3xl font-light">{loading ? <span className="inline-block w-10 h-8 bg-white/10 rounded animate-pulse" /> : `${chanceOfRainToday}%`}</p>
                </div>
                <div className="backdrop-blur-xs bg-white/5 shadow-lg rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <WiBarometer size={20} color="#94a3b8" />
                    <p className="text-white/[0.6] text-sm uppercase tracking-wide">Pressure</p>
                  </div>
                  <p className="text-3xl font-light">
                    {loading ? (
                      <span className="inline-block w-16 h-8 bg-white/10 rounded animate-pulse" />
                    ) : current ? (
                      (() => {
                        const hpa = current.pressure ?? 0
                        switch (units.pressure) {
                          case "hpa": {
                            return `${hpa} hPa`
                          }
                          case "kpa": {
                            const kpa = (hpa / 10).toFixed(1)
                            return `${kpa} kPa`
                          }
                          case "mm": {
                            const mmHg = Math.round(hpa * 0.750061683)
                            return `${mmHg} mmHg`
                          }
                          case "inches":
                          default: {
                            const inHg = (hpa / 33.8638866667).toFixed(2)
                            return `${inHg} inHg`
                          }
                        }
                      })()
                    ) : (
                      "-"
                    )}
                  </p>
                </div>
                <div className="backdrop-blur-xs bg-white/5 shadow-lg rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <WiSunset size={20} color="#94a3b8" />
                    <p className="text-white/[0.6] text-sm uppercase tracking-wide">Sunset</p>
                  </div>
                  <p className="text-3xl font-light">{loading ? <span className="inline-block w-16 h-8 bg-white/10 rounded animate-pulse" /> : (data && (data.daily?.[0]?.sunset || current?.sunset) ? formatLocalTime((data.daily?.[0]?.sunset || current?.sunset)!, tz, { hour: "2-digit", minute: "2-digit", hour12: timeFormat12h }) : "-")}</p>
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
            <p className="text-2xl font-light">{
              current ? (() => {
                const baseMs = units.temperature === "fahrenheit" ? (current.wind_speed ?? 0) * 0.44704 : (current.wind_speed ?? 0)
                const { windSpeed } = units
                if (windSpeed === "kmh") return `${Math.round(baseMs * 3.6)} km/h`
                if (windSpeed === "ms") return `${Math.round(baseMs)} m/s`
                return `${Math.round(baseMs * 1.943844)} knots`
              })() : "-"
            }</p>
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
      <div className="w-80 fixed right-6 h-[calc(100vh-3rem)] backdrop-blur-xs bg-white/5 shadow-lg rounded-2xl p-6">
        <div className="pointer-events-none absolute inset-0 rounded-2xl [mask-image:radial-gradient(80%_60%_at_50%_0%,black,transparent)] bg-white/5"></div>
        <h3 className="text-white text-sm font-medium mb-6 uppercase tracking-wider">7-Day Forecast</h3>
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
