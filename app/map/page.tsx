"use client"

import { useState } from "react"
import { WiDaySunny, WiRain, WiDayCloudyHigh } from "weather-icons-react"
import { Plus, Minus, Navigation } from "lucide-react"
import { FaLocationDot } from "react-icons/fa6"
import { SearchBar } from "@/components/search-bar"

export default function MapPage() {
  const [selectedCity, setSelectedCity] = useState("Madrid")

  const cities = [
    {
      name: "Bilbao",
      temp: 27,
      condition: "Rainy",
      time: "10:23",
      icon: WiRain,
      position: { top: "20%", left: "25%" },
    },
    {
      name: "Barcelona",
      temp: 29,
      condition: "Sunny",
      time: "10:23",
      icon: WiDaySunny,
      position: { top: "35%", right: "15%" },
    },
    {
      name: "Madrid",
      temp: 31,
      condition: "Sunny",
      time: "10:23",
      icon: WiDaySunny,
      position: { top: "55%", left: "35%" },
    },
    {
      name: "Malaga",
      temp: 33,
      condition: "Partly cloudy",
      time: "10:23",
      icon: WiDayCloudyHigh,
      position: { bottom: "15%", left: "30%" },
    },
  ]

  return (
    <div className="mx-auto flex gap-6">

      {/* Main Content */}
      <div className="flex-1 space-y-6 mt-18">
        <SearchBar />

        {/* Map Container */}
        <div className="relative bg-gradient-to-br from-green-300 via-green-200 to-blue-300 rounded-2xl h-[600px] overflow-hidden">
          {/* Map Background - Spain outline */}
          <svg
            viewBox="0 0 800 600"
            className="absolute inset-0 w-full h-full"
            style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}
          >
            {/* Simplified Spain map outline */}
            <path
              d="M150 200 L200 180 L280 160 L350 170 L420 180 L480 190 L520 200 L580 220 L620 250 L640 300 L630 350 L600 400 L550 450 L500 480 L450 500 L400 510 L350 520 L300 510 L250 500 L200 480 L170 450 L150 400 L140 350 L145 300 Z"
              fill="rgba(255,255,255,0.3)"
              stroke="rgba(0,0,0,0.2)"
              strokeWidth="2"
            />
            {/* Water areas */}
            <circle cx="100" cy="300" r="80" fill="rgba(59, 130, 246, 0.4)" />
            <circle cx="700" cy="400" r="60" fill="rgba(59, 130, 246, 0.4)" />
          </svg>

          {/* Weather Cards on Map */}
          {cities.map((city) => (
            <div key={city.name} className="absolute" style={city.position}>
              <div className="backdrop-blur-sm bg-white/10 shadow-lg rounded-lg p-4 min-w-[120px]">
                <div className="pointer-events-none absolute inset-0 rounded-2xl [mask-image:radial-gradient(80%_60%_at_50%_0%,black,transparent)] bg-white/10"></div>
                <div className="text-center">
                  <h3 className="font-semibold text-white mb-2">{city.name}</h3>
                  <div className="flex items-center justify-center mb-2">
                    <city.icon size={32} color="#fbbf24" />
                  </div>
                  <div className="text-2xl font-bold text-white">{city.temp}°</div>
                  {city.name === "Madrid" && (
                    <button className="mt-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-sm text-white transition-colors">
                      See detail
                    </button>
                  )}
                </div>
              </div>
              {/* Location icon */}
              <div className="absolute top-full left-1/2 -translate-x-1/2">
                <FaLocationDot className="text-red-600" size={14} />
              </div>
            </div>
          ))}

          {/* Map Controls */}
          <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
            <button className="w-10 h-10 backdrop-blur-sm bg-white/20 shadow-lg rounded-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
              <Plus size={20} />
            </button>
            <button className="w-10 h-10 backdrop-blur-sm bg-white/20 shadow-lg rounded-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
              <Minus size={20} />
            </button>
          </div>

          <div className="absolute right-6 bottom-6">
            <button className="w-10 h-10 backdrop-blur-sm bg-white/20 shadow-lg rounded-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
              <Navigation size={20} />
            </button>
          </div>

          {/* Done button */}
          <div className="absolute top-6 left-6">
            <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-full text-white font-medium transition-colors">
              Done
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Cities List */}
      <div className="w-80 backdrop-blur-xs bg-white/5 shadow-lg  rounded-2xl p-6">
        <div className="space-y-4">
          {cities.map((city) => (
            <div
              key={city.name}
              className="bg-white/10 rounded-lg p-4 flex items-center justify-between hover:bg-white/20 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <city.icon size={24} color="#fbbf24" />
                <div>
                  <div className="font-semibold text-white">{city.name}</div>
                  <div className="text-sm text-white/60">{city.time}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{city.temp}°</div>
                <div className="text-sm text-white/60">{city.condition}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
