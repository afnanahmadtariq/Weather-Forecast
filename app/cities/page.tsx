"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Navigation } from "@/components/navigation"

export default function CitiesPage() {
  const [selectedCity, setSelectedCity] = useState("Madrid")

  const cities = [
    {
      name: "Madrid",
      temp: "31°",
      time: "10:23",
      condition: "sunny",
      icon: "/bright-sunny-weather-icon-golden-orange.png",
    },
    {
      name: "Vienna",
      temp: "27°",
      time: "11:23",
      condition: "rainy",
      icon: "/small-rainy-weather-icon-with-raindrops.png",
    },
    {
      name: "Athens",
      temp: "33°",
      time: "12:23",
      condition: "storm",
      icon: "/small-storm-weather-icon-with-lightning-bolt.png",
    },
  ]

  const selectedCityData = cities.find((city) => city.name === selectedCity) || cities[0]

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto flex gap-6">
        <Navigation />

        {/* Main Content - Cities List */}
        <div className="flex-1 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search for cities"
              className="bg-slate-800/50 border-slate-700 pl-12 h-12 text-white placeholder:text-slate-400"
            />
          </div>

          {/* Cities List */}
          <div className="space-y-4">
            {cities.map((city) => (
              <div
                key={city.name}
                onClick={() => setSelectedCity(city.name)}
                className={`bg-slate-800/50 rounded-2xl p-6 cursor-pointer transition-all ${
                  selectedCity === city.name ? "ring-2 ring-blue-500" : "hover:bg-slate-800/70"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src={city.icon || "/placeholder.svg"} alt={city.condition} className="w-16 h-16" />
                    <div>
                      <h3 className="text-2xl font-light mb-1">{city.name}</h3>
                      <p className="text-slate-400 text-sm">{city.time}</p>
                    </div>
                  </div>
                  <div className="text-4xl font-light">{city.temp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar - Selected City Details */}
        <div className="w-80 space-y-6">
          {/* Current Weather for Selected City */}
          <div className="bg-slate-800/50 rounded-2xl p-6">
            <div className="text-center">
              <h2 className="text-3xl font-light mb-2">{selectedCityData.name}</h2>
              <p className="text-slate-400 mb-6">Chance of rain: 0%</p>
              <img
                src={selectedCityData.icon || "/placeholder.svg"}
                alt={selectedCityData.condition}
                className="w-24 h-24 mx-auto mb-4"
              />
              <div className="text-6xl font-light">{selectedCityData.temp}</div>
            </div>
          </div>

          {/* Today's Forecast */}
          <div className="bg-slate-800/50 rounded-2xl p-6">
            <h3 className="text-slate-400 text-sm font-medium mb-6 uppercase tracking-wider">Today's Forecast</h3>
            <div className="space-y-4">
              {[
                { time: "6:00 AM", temp: "25°", icon: "/grey-cloudy-weather-icon.png" },
                { time: "9:00 AM", temp: "28°", icon: "/partly-sunny-weather-icon-with-sun-and-clouds.png" },
                { time: "12:00 PM", temp: "33°", icon: "/bright-sunny-weather-icon-golden-orange.png" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">{item.time}</span>
                  <div className="flex items-center gap-3">
                    <img src={item.icon || "/placeholder.svg"} alt="Weather" className="w-8 h-8" />
                    <span className="text-white font-medium">{item.temp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3-Day Forecast */}
          <div className="bg-slate-800/50 rounded-2xl p-6">
            <h3 className="text-slate-400 text-sm font-medium mb-6 uppercase tracking-wider">3-Day Forecast</h3>
            <div className="space-y-4">
              {[
                {
                  day: "Today",
                  condition: "Sunny",
                  high: "36",
                  low: "22",
                  icon: "/small-sunny-weather-icon-golden-orange.png",
                },
                {
                  day: "Tue",
                  condition: "Sunny",
                  high: "37",
                  low: "21",
                  icon: "/small-sunny-weather-icon-golden-orange.png",
                },
                {
                  day: "Wed",
                  condition: "Sunny",
                  high: "37",
                  low: "21",
                  icon: "/small-sunny-weather-icon-golden-orange.png",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 text-slate-400 text-sm">{item.day}</div>
                    <img src={item.icon || "/placeholder.svg"} alt={item.condition} className="w-8 h-8" />
                    <div className="text-white">{item.condition}</div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-white">{item.high}</span>
                    <span className="text-slate-400">/{item.low}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
