"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FaMapMarkedAlt } from "react-icons/fa"
import { MdSpaceDashboard } from "react-icons/md";
import { FiSettings } from "react-icons/fi"
import { FaCity } from "react-icons/fa6"
import { HiX, HiMenu } from "react-icons/hi"

export function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const navItems = [
    { href: "/", icon: MdSpaceDashboard, label: "Home" },
    { href: "/cities", icon: FaCity, label: "Cities" },
    { href: "/map", icon: FaMapMarkedAlt, label: "Map" },
    { href: "/settings", icon: FiSettings, label: "Settings" },
  ]

  return (
    <>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 sm:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sliding Menu */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-white/5 backdrop-blur-md z-50 
        transform transition-transform duration-300 ease-in-out sm:hidden
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6">
          {/* Close Button */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <img src="/weather/partly-cloudy.png" alt="Menu" className="w-6 h-6" />
              <span className="text-white text-sm font-medium uppercase tracking-wider">Menu</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <HiX size={20} color="white" />
            </button>
          </div>

          {/* Mobile Menu Items */}
          <nav className="space-y-3">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    relative group rounded-xl p-4 border border-white/10 
                    transition-colors flex items-center gap-3
                    ${isActive ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'}
                  `}
                >
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <Icon size={20} color={isActive ? "white" : "#FFFFFFCC"} />
                  </div>
                  <span className={`text-sm ${isActive ? "text-white" : "text-white/80"}`}>
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      <div className="top-5 sm:w-16 sm:h-[calc(100vh-3rem)] fixed z-20 backdrop-blur-xs bg-white/5 shadow-lg rounded-2xl p-2 flex flex-col items-center gap-8">
        <div className="pointer-events-none absolute inset-0 rounded-2xl [mask-image:radial-gradient(80%_60%_at_50%_0%,black,transparent)] bg-white/5"></div>
        
        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setIsMobileMenuOpen(true)}
          className="z-30 p-2 bg-white/20 rounded-lg w-10 h-10 flex items-center justify-center sm:hidden"
        >
          <HiMenu size={20} color="white" />
        </button>

        {/* Desktop Logo */}
        <div className="hidden sm:flex p-2 bg-blue-500 rounded-lg w-10 h-10 items-center justify-center">
          <img
            src="/weather/partly-cloudy.png"
            alt=""
            className="w-full h-full object-contain"
            width={40}
            height={40}
          />
        </div>
        {/* Desktop Navigation Items */}
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href} className="hidden sm:flex flex-col items-center gap-2">
              <div className={`p-2 rounded-lg hover:bg-white/10 cursor-pointer ${isActive ? "bg-white/20" : "bg-white/5"}`}>
                <Icon size={20} color={isActive ? "white" : "#FFFFFF99"} />
              </div>
              <span className={`text-xs ${isActive ? "text-white" : "text-white/[0.6]"}`}>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </>
  )
}
