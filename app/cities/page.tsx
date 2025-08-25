"use client"

import { useState } from "react"
import { SearchBar } from "@/components/search-bar"

export default function CitiesPage() {
  const [selectedCity, setSelectedCity] = useState("Madrid")

  const cities = [
    {
      name: "Madrid",
      temp: "31°",
      time: "10:23",
      condition: "sunny",
      icon: "/weather/sunny.png",
    },
    {
      name: "Vienna",
      temp: "27°",
      time: "11:23",
      condition: "rainy",
      icon: "/weather/rainy.png",
    },
    {
      name: "Athens",
      temp: "33°",
      time: "12:23",
      condition: "storm",
      icon: "/weather/snow.png",
    },
    {
      name: "Madrid",
      temp: "31°",
      time: "10:23",
      condition: "sunny",
      icon: "/weather/sunny.png",
    },
    {
      name: "Vienna",
      temp: "27°",
      time: "11:23",
      condition: "rainy",
      icon: "/weather/rainy.png",
    },
    {
      name: "Athens",
      temp: "33°",
      time: "12:23",
      condition: "storm",
      icon: "/weather/snow.png",
    },
    {
      name: "Madrid",
      temp: "31°",
      time: "10:23",
      condition: "sunny",
      icon: "/weather/sunny.png",
    },
    {
      name: "Vienna",
      temp: "27°",
      time: "11:23",
      condition: "rainy",
      icon: "/weather/rainy.png",
    },
    {
      name: "Athens",
      temp: "33°",
      time: "12:23",
      condition: "storm",
      icon: "/weather/snow.png",
    },
  ]

  const selectedCityData = cities.find((city) => city.name === selectedCity) || cities[0]

  return (
    <div className="mx-auto flex gap-6">

      {/* Main Content - Cities List */}
      <div className="flex-1 space-y-6 mr-86 mt-18">
        <SearchBar />

        {/* Cities List */}
        <div className="space-y-4">
          {cities.map((city) => (
            <div
              key={city.name}
              onClick={() => setSelectedCity(city.name)}
              className={`backdrop-blur-xs bg-white/5 shadow-lg rounded-2xl p-6 cursor-pointer transition-all ${
                selectedCity === city.name ? "bg-white/20" : "hover:bg-white/10"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={city.icon} alt={city.condition} className="w-16 h-auto" />
                  <div>
                    <h3 className="text-2xl font-base mb-1">{city.name}</h3>
                    <p className="text-white/60 text-sm">{city.time}</p>
                  </div>
                </div>
                <div className="text-4xl font-light">{city.temp}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Sidebar - Selected City Details */}
      <div className="w-80 space-y-6 fixed right-6">
        {/* Current Weather for Selected City */}
        <div className="backdrop-blur-xs bg-white/5 shadow-lg rounded-2xl p-6 flex flex-row justify-between items-center">
          <div className="text-left">
            <h2 className="text-4xl font-base mb-2">{selectedCityData.name}</h2>
            <p className="text-white/60 mb-4 text-sm">Chance of rain: 0%</p>
            <div className="text-5xl font-base">{selectedCityData.temp}</div>
          </div>
          <img
            src={selectedCityData.icon}
            alt={selectedCityData.condition}
            className="w-24 h-24"
          />
        </div>

        {/* Today's Forecast */}
        <div className="backdrop-blur-xs bg-white/5 shadow-lg rounded-2xl p-6">
          <h3 className="text-white text-sm font-medium mb-6 uppercase tracking-wider">Today's Forecast</h3>
          <div className="flex flex-row justify-center items-stretch divide-x divide-white/20">
            {[
              { time: "6:00 AM", temp: "25°", icon: "/weather/cloudy.png" },
              { time: "9:00 AM", temp: "28°", icon: "/weather/partly-cloudy.png" },
              { time: "12:00 PM", temp: "33°", icon: "/weather/sunny.png" },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center justify-between gap-4 px-6">
                <span className="text-white/60 text-sm whitespace-nowrap">{item.time}</span>
                <img src={item.icon} alt="Weather" className="w-16 h-auto" />
                <span className="text-white font-medium">{item.temp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3-Day Forecast */}
        <div className="backdrop-blur-xs bg-white/5 shadow-lg rounded-2xl p-6">
          <h3 className="text-white text-sm font-medium mb-6 uppercase tracking-wider">3-Day Forecast</h3>
          <div className="space-y-4">
            {[
              {
                day: "Today",
                condition: "Sunny",
                high: "36",
                low: "22",
                icon: "/weather/sunny.png",
              },
              {
                day: "Tue",
                condition: "Sunny",
                high: "37",
                low: "21",
                icon: "/weather/sunny.png",
              },
              {
                day: "Wed",
                condition: "Sunny",
                high: "37",
                low: "21",
                icon: "/weather/sunny.png",
              },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 text-white/60 text-sm">{item.day}</div>
                  <img src={item.icon} alt={item.condition} className="w-8 h-auto" />
                  <div className="text-white">{item.condition}</div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-white">{item.high}</span>
                  <span className="text-white/60">/{item.low}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
