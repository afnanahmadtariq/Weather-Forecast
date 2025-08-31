"use client"

import Link from "next/link"
import { FaCity, FaMapMarkedAlt } from "react-icons/fa"
import { FiSettings } from "react-icons/fi"
import { MdSpaceDashboard } from "react-icons/md"

export default function MobileMenu() {
  const navItems = [
    { href: "/", icon: MdSpaceDashboard, label: "Home" },
    { href: "/cities", icon: FaCity, label: "Cities" },
    { href: "/map", icon: FaMapMarkedAlt, label: "Map" },
    { href: "/settings", icon: FiSettings, label: "Settings" },
  ]
  return (
    <div className="mx-auto flex flex-col sm:flex-row gap-6">
      {/* Main Content */}
      <div className="flex-1 space-y-6 sm:mr-86 mt-18">
        {/* Themed Container */}
        <div className="relative backdrop-blur-xs bg-white/5 shadow-lg rounded-2xl p-6">
          <div className="pointer-events-none absolute inset-0 rounded-2xl [mask-image:radial-gradient(80%_60%_at_50%_0%,black,transparent)] bg-white/5"></div>

          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <img src="/weather/partly-cloudy.png" alt="Menu" className="w-6 h-6" />
            <span className="text-white text-sm font-medium uppercase tracking-wider">Menu</span>
          </div>

          {/* Grid Menu */}
          <nav className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative group rounded-xl p-4 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <Icon size={20} color="#FFFFFFCC" />
                  </div>
                  <span className="text-white text-sm">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}
