"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Navigation } from "@/components/navigation"

export default function SettingsPage() {
  const [units, setUnits] = useState({
    temperature: "celsius",
    windSpeed: "kmh",
    pressure: "mm",
    precipitation: "millimeters",
    distance: "kilometers",
  })

  const [notifications, setNotifications] = useState(true)
  const [twelveHourTime, setTwelveHourTime] = useState(true)
  const [location, setLocation] = useState(true)

  const updateUnit = (category: string, value: string) => {
    setUnits((prev) => ({ ...prev, [category]: value }))
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto flex gap-6">
        <Navigation />

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search for cities"
              className="bg-slate-800/50 border-slate-700 pl-12 h-12 text-white placeholder:text-slate-400"
            />
          </div>

          {/* Units Section */}
          <div className="bg-slate-800/50 rounded-2xl p-6 space-y-6">
            <h2 className="text-xl font-semibold">Units</h2>

            {/* Temperature */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wide">Temperature</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => updateUnit("temperature", "celsius")}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                    units.temperature === "celsius"
                      ? "bg-slate-600 text-white"
                      : "bg-slate-700/50 text-slate-400 hover:bg-slate-600/50"
                  }`}
                >
                  Celsius
                </button>
                <button
                  onClick={() => updateUnit("temperature", "fahrenheit")}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                    units.temperature === "fahrenheit"
                      ? "bg-slate-600 text-white"
                      : "bg-slate-700/50 text-slate-400 hover:bg-slate-600/50"
                  }`}
                >
                  Fahrenheit
                </button>
              </div>
            </div>

            {/* Wind Speed */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wide">Wind Speed</h3>
              <div className="flex space-x-2">
                {["kmh", "ms", "knots"].map((unit) => (
                  <button
                    key={unit}
                    onClick={() => updateUnit("windSpeed", unit)}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                      units.windSpeed === unit
                        ? "bg-slate-600 text-white"
                        : "bg-slate-700/50 text-slate-400 hover:bg-slate-600/50"
                    }`}
                  >
                    {unit === "kmh" ? "km/h" : unit === "ms" ? "m/s" : "Knots"}
                  </button>
                ))}
              </div>
            </div>

            {/* Pressure */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wide">Pressure</h3>
              <div className="grid grid-cols-4 gap-2">
                {["hpa", "inches", "kpa", "mm"].map((unit) => (
                  <button
                    key={unit}
                    onClick={() => updateUnit("pressure", unit)}
                    className={`py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                      units.pressure === unit
                        ? "bg-slate-600 text-white"
                        : "bg-slate-700/50 text-slate-400 hover:bg-slate-600/50"
                    }`}
                  >
                    {unit === "hpa" ? "hPa" : unit === "kpa" ? "kPa" : unit}
                  </button>
                ))}
              </div>
            </div>

            {/* Precipitation */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wide">Precipitation</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => updateUnit("precipitation", "millimeters")}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                    units.precipitation === "millimeters"
                      ? "bg-slate-600 text-white"
                      : "bg-slate-700/50 text-slate-400 hover:bg-slate-600/50"
                  }`}
                >
                  Millimeters
                </button>
                <button
                  onClick={() => updateUnit("precipitation", "inches")}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                    units.precipitation === "inches"
                      ? "bg-slate-600 text-white"
                      : "bg-slate-700/50 text-slate-400 hover:bg-slate-600/50"
                  }`}
                >
                  Inches
                </button>
              </div>
            </div>

            {/* Distance */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wide">Distance</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => updateUnit("distance", "kilometers")}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                    units.distance === "kilometers"
                      ? "bg-slate-600 text-white"
                      : "bg-slate-700/50 text-slate-400 hover:bg-slate-600/50"
                  }`}
                >
                  Kilometers
                </button>
                <button
                  onClick={() => updateUnit("distance", "miles")}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                    units.distance === "miles"
                      ? "bg-slate-600 text-white"
                      : "bg-slate-700/50 text-slate-400 hover:bg-slate-600/50"
                  }`}
                >
                  Miles
                </button>
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-slate-800/50 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>

            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
              <div>
                <h3 className="font-medium">Notifications</h3>
                <p className="text-sm text-slate-400">Be aware of the weather</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications ? "bg-blue-500" : "bg-slate-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* General Section */}
          <div className="bg-slate-800/50 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">General</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
                <div>
                  <h3 className="font-medium">12-Hour Time</h3>
                </div>
                <button
                  onClick={() => setTwelveHourTime(!twelveHourTime)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    twelveHourTime ? "bg-blue-500" : "bg-slate-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      twelveHourTime ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
                <div>
                  <h3 className="font-medium">Location</h3>
                  <p className="text-sm text-slate-400">Get weather of your location</p>
                </div>
                <button
                  onClick={() => setLocation(!location)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    location ? "bg-blue-500" : "bg-slate-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      location ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 space-y-6">
          <div className="bg-slate-800/50 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Advanced</h2>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Get new experience</h3>

              <ul className="space-y-2 text-sm text-slate-300">
                <li>• Ad free</li>
                <li>• Health activities overview</li>
                <li>• Severe weather notifications</li>
              </ul>

              <div className="bg-slate-700/50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold">
                  $5.99<span className="text-sm font-normal text-slate-400">/month</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Never forget your umbrella!</h2>

            <p className="text-sm text-slate-400 mb-6">
              Sign up for our daily weather newsletter personalized just for you.
            </p>

            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-colors">
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
