"use client"

import { useState } from "react"
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

export default function WeatherApp() {
  const [showMoreConditions, setShowMoreConditions] = useState(false)

  return (
    <div className="mx-auto flex gap-6">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-0 rounded-2xl [mask-image:radial-gradient(80%_60%_at_50%_0%,black,transparent)] bg-white/5"></div>
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/[0.6]" />
          <Input
            placeholder="Search for cities"
            className="backdrop-blur-xs bg-white/5 shadow-lg border-white/20 pl-12 h-12 text-white placeholder:text-white/[0.8]"
          />
        </div>

        {/* Current Weather */}
        <div className="backdrop-blur-xs bg-white/5 shadow-lg rounded-2xl p-8">
          <div className="pointer-events-none absolute inset-0 rounded-2xl [mask-image:radial-gradient(80%_60%_at_50%_0%,black,transparent)] bg-white/5"></div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-light mb-2">Madrid</h1>
              <p className="text-white/[0.6] mb-8">Chance of rain: 0%</p>
              <div className="text-8xl font-light">31°</div>
            </div>
            <div className="relative">
              <img
                src="/weather/windy.png"
                alt="Sunny weather"
                className="w-auto h-32"
              />
            </div>
          </div>
        </div>

        {/* Today's Forecast */}
        <div className="backdrop-blur-xs bg-white/5 shadow-lg rounded-2xl p-6">
          <div className="pointer-events-none absolute inset-0 rounded-2xl [mask-image:radial-gradient(80%_60%_at_50%_0%,black,transparent)] bg-white/5"></div>
          <h3 className="text-white/[0.6] text-sm font-medium mb-6 uppercase tracking-wider">Today's Forecast</h3>
          <div className="grid grid-cols-6 gap-4">
            {[
              { time: "6:00 AM", temp: "25°", icon: "cloudy" },
              { time: "9:00 AM", temp: "28°", icon: "partly-sunny" },
              { time: "12:00 PM", temp: "33°", icon: "sunny" },
              { time: "3:00 PM", temp: "34°", icon: "sunny" },
              { time: "6:00 PM", temp: "32°", icon: "sunny" },
              { time: "9:00 PM", temp: "30°", icon: "partly-cloudy" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <p className="text-white/[0.6] text-sm mb-4">{item.time}</p>
                <div className="flex justify-center mb-4">
                  {item.icon === "cloudy" && (
                    <img src="/weather/cloudy.png" alt="Cloudy" className="w-12 h-auto" />
                  )}
                  {item.icon === "partly-sunny" && (
                    <img
                      src="/weather/partly-cloudy.png"
                      alt="Partly sunny"
                      className="w-12 h-auto"
                    />
                  )}
                  {item.icon === "sunny" && (
                    <img src="/weather/sunny.png" alt="Sunny" className="w-12 h-auto" />
                  )}
                  {item.icon === "partly-cloudy" && (
                    <img
                      src="/weather/partly-cloudy.png"
                      alt="Partly cloudy"
                      className="w-12 h-auto"
                    />
                  )}
                </div>
                <p className="text-white font-medium">{item.temp}</p>
              </div>
            ))}
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
                  <p className="text-3xl font-light">3</p>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <WiStrongWind size={20} color="#94a3b8" />
                    <p className="text-white/[0.6] text-sm uppercase tracking-wide">Wind</p>
                  </div>
                  <p className="text-3xl font-light">0.2 km/h</p>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <WiHumidity size={20} color="#94a3b8" />
                    <p className="text-white/[0.6] text-sm uppercase tracking-wide">Humidity</p>
                  </div>
                  <p className="text-3xl font-light">56%</p>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <WiDayFog size={20} color="#94a3b8" />
                    <p className="text-white/[0.6] text-sm uppercase tracking-wide">Visibility</p>
                  </div>
                  <p className="text-3xl font-light">12 km</p>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <WiThermometer size={20} color="#94a3b8" />
                    <p className="text-white/[0.6] text-sm uppercase tracking-wide">Feels Like</p>
                  </div>
                  <p className="text-3xl font-light">30°</p>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <WiHumidity size={20} color="#94a3b8" />
                    <p className="text-white/[0.6] text-sm uppercase tracking-wide">Chance of Rain</p>
                  </div>
                  <p className="text-3xl font-light">0%</p>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <WiBarometer size={20} color="#94a3b8" />
                    <p className="text-white/[0.6] text-sm uppercase tracking-wide">Pressure</p>
                  </div>
                  <p className="text-3xl font-light">1008 hPa</p>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <WiSunset size={20} color="#94a3b8" />
                    <p className="text-white/[0.6] text-sm uppercase tracking-wide">Sunset</p>
                  </div>
                  <p className="text-3xl font-light">20:58</p>
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
                      <p className="text-2xl font-light">30°</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <WiHumidity size={20} color="#94a3b8" />
                    <div>
                      <p className="text-white/[0.6] text-sm">Chance of rain</p>
                      <p className="text-2xl font-light">0%</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <WiStrongWind size={20} color="#94a3b8" />
                    <div>
                      <p className="text-white/[0.6] text-sm">Wind</p>
                      <p className="text-2xl font-light">0.2 km/h</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <WiDayHaze size={20} color="#94a3b8" />
                    <div>
                      <p className="text-white/[0.6] text-sm">UV Index</p>
                      <p className="text-2xl font-light">3</p>
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
          {[
            { day: "Today", icon: "sunny", condition: "Sunny", high: "36", low: "22" },
            { day: "Tue", icon: "sunny", condition: "Sunny", high: "37", low: "21" },
            { day: "Wed", icon: "sunny", condition: "Sunny", high: "37", low: "21" },
            { day: "Thu", icon: "cloudy", condition: "Cloudy", high: "37", low: "21" },
            { day: "Fri", icon: "cloudy", condition: "Cloudy", high: "37", low: "21" },
            { day: "Sat", icon: "rainy", condition: "Rainy", high: "37", low: "21" },
            { day: "Sun", icon: "storm", condition: "Storm", high: "37", low: "21" },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-4">
                <div className="w-12 text-white/[0.6] text-sm">{item.day}</div>
                <div className="w-8 h-auto flex items-center justify-center">
                  {item.icon === "sunny" && (
                    <img src="/weather/sunny.png" alt="Sunny" className="w-8 h-auto" />
                  )}
                  {item.icon === "cloudy" && (
                    <img src="/weather/cloudy.png" alt="Cloudy" className="w-8 h-auto" />
                  )}
                  {item.icon === "rainy" && (
                    <img src="/weather/rainy.png" alt="Rainy" className="w-8 h-auto" />
                  )}
                  {item.icon === "storm" && (
                    <img src="/weather/small-storm-weather-icon-with-lightning-bolt.png" alt="Storm" className="w-8 h-auto" />
                  )}
                </div>
                <div className="text-white">{item.condition}</div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-white">{item.high}</span>
                <span className="text-white/[0.6]">/{item.low}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
