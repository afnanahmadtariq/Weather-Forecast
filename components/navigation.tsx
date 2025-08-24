"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { WiWindy, WiDaySunny } from "weather-icons-react"

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", icon: WiDaySunny, label: "Weather" },
    { href: "/cities", icon: "grid", label: "Cities" },
    { href: "/map", icon: "map", label: "Map" },
    { href: "/settings", icon: "menu", label: "Settings" },
  ]

  return (
    <div className="w-16 h-[calc(100vh-3rem)] fixed backdrop-blur-lg bg-white/10 shadow-lg rounded-2xl p-4 flex flex-col items-center gap-8">
    <div className="pointer-events-none absolute inset-0 rounded-2xl
    [mask-image:radial-gradient(80%_60%_at_50%_0%,black,transparent)]
    bg-white/30"></div>
      <div className="p-2 bg-blue-500 rounded-lg">
        <WiWindy size={24} color="white" />
      </div>
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link key={item.href} href={item.href} className="flex flex-col items-center gap-2">
            <div className={`p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer ${isActive ? "bg-blue-500" : ""}`}>
              {item.icon === WiDaySunny ? (
                <WiDaySunny size={24} color={isActive ? "white" : "#94a3b8"} />
              ) : item.icon === "grid" ? (
                <div className="w-6 h-6 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-0.5">
                    <div className={`w-1 h-1 rounded-full ${isActive ? "bg-white" : "bg-slate-400"}`}></div>
                    <div className={`w-1 h-1 rounded-full ${isActive ? "bg-white" : "bg-slate-400"}`}></div>
                    <div className={`w-1 h-1 rounded-full ${isActive ? "bg-white" : "bg-slate-400"}`}></div>
                    <div className={`w-1 h-1 rounded-full ${isActive ? "bg-white" : "bg-slate-400"}`}></div>
                  </div>
                </div>
              ) : item.icon === "map" ? (
                <div className="w-6 h-6 flex items-center justify-center">
                  <div
                    className={`w-4 h-4 border-2 rounded-sm relative ${isActive ? "border-white" : "border-slate-400"}`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-1 h-1 rounded-full ${isActive ? "bg-white" : "bg-slate-400"}`}
                    ></div>
                  </div>
                </div>
              ) : (
                <div className="w-6 h-6 flex items-center justify-center">
                  <div className="space-y-1">
                    <div className={`w-4 h-0.5 rounded ${isActive ? "bg-white" : "bg-slate-400"}`}></div>
                    <div className={`w-4 h-0.5 rounded ${isActive ? "bg-white" : "bg-slate-400"}`}></div>
                    <div className={`w-4 h-0.5 rounded ${isActive ? "bg-white" : "bg-slate-400"}`}></div>
                  </div>
                </div>
              )}
            </div>
            <span className={`text-xs ${isActive ? "text-white" : "text-slate-400"}`}>{item.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
