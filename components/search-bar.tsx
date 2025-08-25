"use client"

import React, { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useWeather } from "@/components/weather-provider"

type Props = {
  className?: string
  placeholder?: string
}

export function SearchBar({ className, placeholder = "Search for cities" }: Props) {
  const { searchCity, loading } = useWeather()
  const [query, setQuery] = useState("")

  const onSearch = async () => {
    if (!query.trim()) return
    await searchCity(query)
  }

  return (
    <div className={"relative " + (className ?? "")}> 
      <div className="pointer-events-none absolute inset-0 rounded-2xl [mask-image:radial-gradient(80%_60%_at_50%_0%,black,transparent)] bg-white/5"></div>
      <Search className="absolute left-4 top-1/2 z-10 transform -translate-y-1/2 w-5 h-5 text-white/[0.6]" />
      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          placeholder={placeholder}
          disabled={loading}
          className="flex-1 backdrop-blur-xs bg-white/5 shadow-lg border-white/20 pl-12 h-12 text-white placeholder:text-white/[0.8]"
        />
      </div>
    </div>
  )
}
