"use client"

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { toast } from "@/hooks/use-toast"

// Shared weather types
export type OwmWeather = {
  id: number
  main: string
  description: string
  icon: string
}

export type OwmCurrent = {
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

export type OwmHourly = {
  dt: number
  temp: number
  pop?: number
  wind_speed?: number
  humidity?: number
  visibility?: number
  weather: OwmWeather[]
}

export type OwmDaily = {
  dt: number
  sunrise?: number
  sunset?: number
  temp: { min: number; max: number }
  pop?: number
  weather: OwmWeather[]
}

export type OwmOneCall = {
  timezone_offset: number
  current: OwmCurrent
  hourly: OwmHourly[]
  daily: OwmDaily[]
}

type Coords = { lat: number; lon: number }

type WeatherContextValue = {
  city: string
  coords: Coords
  data: OwmOneCall | null
  loading: boolean
  // Actions
  searchCity: (q: string) => Promise<boolean>
  setCoords: (coords: Coords, label?: string) => void
}

const WeatherContext = createContext<WeatherContextValue | undefined>(undefined)

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const [city, setCity] = useState<string>("Madrid, ES")
  const [coords, setCoordsState] = useState<Coords>({ lat: 40.4168, lon: -3.7038 })
  const [data, setData] = useState<OwmOneCall | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  // Helper to set coords (and optional city label) and persist cookie via API where applicable
  const setCoords = useCallback((c: Coords, label?: string) => {
    setCoordsState(c)
    if (label) setCity(label)
  }, [])

  // Initial load: try cookie, else geolocate, else defaults
  useEffect(() => {
    try {
      const raw = document.cookie.split("; ").find((c) => c.startsWith("wf_geo="))?.split("=")[1]
      if (raw) {
        const decoded = decodeURIComponent(raw)
        const parsed = JSON.parse(decoded) as { lat?: number; lon?: number; city?: string }
        if (typeof parsed.lat === "number" && typeof parsed.lon === "number") {
          setCoordsState({ lat: parsed.lat, lon: parsed.lon })
          if (parsed.city) setCity(parsed.city)
          return
        }
      }
    } catch {}

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords
          setCoordsState({ lat: latitude, lon: longitude })
          try {
            // Reverse geocode for label (also sets cookie server-side)
            const res = await fetch(`/api/geocode?lat=${latitude}&lon=${longitude}&limit=1`)
            if (res.ok) {
              const [place] = (await res.json()) as Array<{ name: string; state?: string; country?: string }>
              if (place) setCity(`${place.name}${place.state ? ", " + place.state : ""}${place.country ? ", " + place.country : ""}`)
            }
          } catch {}
        },
        () => {
          toast({ title: "Location permission denied", description: "Using Madrid by default." })
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      )
    }
  }, [])

  // Fetch weather whenever coords change
  useEffect(() => {
    let aborted = false
    const run = async () => {
      try {
        setLoading(true)
        const url = `/api/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric`
        const res = await fetch(url)
        if (!res.ok) throw new Error(`Weather fetch failed: ${res.status}`)
        const json = (await res.json()) as OwmOneCall
        if (!aborted) setData(json)
      } catch (e: any) {
        if (!aborted) {
          toast({ title: "Failed to load weather", description: e?.message ?? "Unknown error" })
          setData(null)
        }
      } finally {
        if (!aborted) setLoading(false)
      }
    }
    run()
    return () => {
      aborted = true
    }
  }, [coords.lat, coords.lon])

  // Search city and update coords + city, cookie is set by API
  const searchCity = useCallback(async (q: string) => {
    const term = q.trim()
    if (!term) return false
    try {
      setLoading(true)
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(term)}&limit=1`)
      if (!res.ok) throw new Error(`Geocode failed: ${res.status}`)
      const arr: Array<{ name: string; country?: string; state?: string; lat: number; lon: number }> = await res.json()
      if (!arr?.length) {
        toast({ title: "No matching city", description: "Try a different search term." })
        return false
      }
      const top = arr[0]
      const label = `${top.name}${top.state ? ", " + top.state : ""}${top.country ? ", " + top.country : ""}`
      setCity(label)
      setCoordsState({ lat: top.lat, lon: top.lon })
      return true
    } catch (e: any) {
      toast({ title: "Search error", description: e?.message ?? "Unknown error" })
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const value = useMemo<WeatherContextValue>(
    () => ({ city, coords, data, loading, searchCity, setCoords }),
    [city, coords, data, loading, searchCity, setCoords]
  )

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
}

export function useWeather() {
  const ctx = useContext(WeatherContext)
  if (!ctx) throw new Error("useWeather must be used within WeatherProvider")
  return ctx
}
