"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FaMapMarkedAlt } from "react-icons/fa"
import { MdSpaceDashboard } from "react-icons/md";
import { FiSettings } from "react-icons/fi"
import { FaCity } from "react-icons/fa6"

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
  { href: "/", icon: MdSpaceDashboard, label: "Home" },
  { href: "/cities", icon: FaCity, label: "Cities" },
  { href: "/map", icon: FaMapMarkedAlt, label: "Map" },
  { href: "/settings", icon: FiSettings, label: "Settings" },
  ]

  return (
    <div className="w-16 h-[calc(100vh-3rem)] fixed backdrop-blur-lg bg-white/5 shadow-lg rounded-2xl p-4 flex flex-col items-center gap-8">
      <div className="pointer-events-none absolute inset-0 rounded-2xl [mask-image:radial-gradient(80%_60%_at_50%_0%,black,transparent)] bg-white/5"></div>
      <div className="p-2 bg-blue-500 rounded-lg w-10 h-10 flex items-center justify-center">
        <img
          src="/weather/partly-cloudy.png"
          alt=""
          className="w-full h-full object-contain"
          width={40}
          height={40}
        />
      </div>
      {navItems.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon
        return (
          <Link key={item.href} href={item.href} className="flex flex-col items-center gap-2">
            <div className={`p-2 rounded-lg hover:bg-white/10 cursor-pointer ${isActive ? "bg-white/20" : "bg-white/5"}`}>
              <Icon size={20} color={isActive ? "white" : "#FFFFFF99"} />
            </div>
            <span className={`text-xs ${isActive ? "text-white" : "text-white/[0.6]"}`}>{item.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
