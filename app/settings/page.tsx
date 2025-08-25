"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Navigation } from "@/components/navigation"
import { useWeather } from "@/components/weather-provider"

export default function SettingsPage() {
  const {
    units,
    updateUnits,
    notificationsEnabled,
    setNotificationsEnabled,
    timeFormat12h,
    setTimeFormat12h,
    locationEnabled,
    setLocationEnabled,
  } = useWeather()

  const updateUnit = (category: keyof typeof units, value: any) => {
    updateUnits({ [category]: value } as any)
  }

  return (
    <div className="mx-auto flex gap-6">

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* General Section */}
        <div className="backdrop-blur-lg bg-white/10 shadow-lg rounded-2xl p-6">
          <div className="pointer-events-none absolute inset-0 rounded-2xl [mask-image:radial-gradient(80%_60%_at_50%_0%,black,transparent)] bg-white/30"></div>
          <h2 className="text-xl font-semibold mb-4">General</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
              <div>
                <h3 className="font-medium">12-Hour Time</h3>
              </div>
              <button
                onClick={() => setTimeFormat12h(!timeFormat12h)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  timeFormat12h ? "bg-blue-500" : "bg-gray-500"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    timeFormat12h ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
              <div>
                <h3 className="font-medium">Location</h3>
                <p className="text-sm text-white/60">Get weather of your location</p>
              </div>
              <button
                onClick={() => setLocationEnabled(!locationEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  locationEnabled ? "bg-blue-500" : "bg-gray-500"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    locationEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="backdrop-blur-lg bg-white/10 shadow-lg rounded-2xl p-6">
          <div className="pointer-events-none absolute inset-0 rounded-2xl [mask-image:radial-gradient(80%_60%_at_50%_0%,black,transparent)] bg-white/30"></div>
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>

          <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
            <div>
              <h3 className="font-medium">Notifications</h3>
              <p className="text-sm text-white/60">Be aware of the weather</p>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                notificationsEnabled ? "bg-blue-500" : "bg-gray-500"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notificationsEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div> 

        {/* Units Section */}
        <div className="backdrop-blur-lg bg-white/10 shadow-lg rounded-2xl p-6 space-y-6">
          <div className="pointer-events-none absolute inset-0 rounded-2xl [mask-image:radial-gradient(80%_60%_at_50%_0%,black,transparent)] bg-white/30"></div>
          <h2 className="text-xl font-semibold">Units</h2>

          {/* Temperature */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wide">Temperature</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => updateUnit("temperature", "celsius")}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  units.temperature === "celsius"
                    ? "bg-blue-500 text-white"
                    : "bg-white/10 text-white/60 hover:bg-blue-500/50"
                }`}
              >
                Celsius
              </button>
              <button
                onClick={() => updateUnit("temperature", "fahrenheit")}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  units.temperature === "fahrenheit"
                    ? "bg-blue-500 text-white"
                    : "bg-white/10 text-white/60 hover:bg-blue-500/50"
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
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    units.windSpeed === unit
                      ? "bg-blue-500 text-white"
                      : "bg-white/10 text-white/60 hover:bg-blue-500/50"
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
                  className={`py-3 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    units.pressure === unit
                      ? "bg-blue-500 text-white"
                      : "bg-white/10 text-white/60 hover:bg-blue-500/50"
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
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  units.precipitation === "millimeters"
                    ? "bg-blue-500 text-white"
                    : "bg-white/10 text-white/60 hover:bg-blue-500/50"
                }`}
              >
                Millimeters
              </button>
              <button
                onClick={() => updateUnit("precipitation", "inches")}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  units.precipitation === "inches"
                    ? "bg-blue-500 text-white"
                    : "bg-white/10 text-white/60 hover:bg-blue-500/50"
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
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  units.distance === "kilometers"
                    ? "bg-blue-500 text-white"
                    : "bg-white/10 text-white/60 hover:bg-blue-500/50"
                }`}
              >
                Kilometers
              </button>
              <button
                onClick={() => updateUnit("distance", "miles")}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  units.distance === "miles"
                    ? "bg-blue-500 text-white"
                    : "bg-white/10 text-white/60 hover:bg-blue-500/50"
                }`}
              >
                Miles
              </button>
            </div>
          </div>
        </div>
               
      </div>

      {/* Right Sidebar */}
      <div className="w-80 space-y-6">
        <div className="backdrop-blur-lg bg-white/10 shadow-lg rounded-2xl p-6">
          <div className="pointer-events-none absolute inset-0 rounded-2xl [mask-image:radial-gradient(80%_60%_at_50%_0%,black,transparent)] bg-white/30"></div>
          <h2 className="text-xl font-semibold mb-4">Advanced</h2>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Get new experience</h3>

            <ul className="space-y-2 text-sm text-slate-300">
              <li>• Ad free</li>
              <li>• Health activities overview</li>
              <li>• Severe weather notifications</li>
            </ul>

            <div className="bg-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">
                $5.99<span className="text-sm font-normal text-white/60">/month</span>
              </div>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-lg bg-white/10 shadow-lg rounded-2xl p-6">
          <div className="pointer-events-none absolute inset-0 rounded-2xl [mask-image:radial-gradient(80%_60%_at_50%_0%,black,transparent)] bg-white/30"></div>
          <h2 className="text-xl font-semibold mb-4">Never forget your umbrella!</h2>

          <p className="text-sm text-white/60 mb-6">
            Sign up for our daily weather newsletter personalized just for you.
          </p>

          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-colors cursor-pointer">
            
            Sign up
          </button>
        </div>
      </div>
    </div>
  )
}
