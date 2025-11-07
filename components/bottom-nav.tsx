"use client"

import { Home, ShoppingCart, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function BottomNav() {
  const pathname = usePathname()
  const [active, setActive] = useState<"games" | "shop" | "settings">("games")

  useEffect(() => {
    if (pathname === "/") setActive("games")
    else if (pathname === "/shop") setActive("shop")
    else if (pathname === "/settings") setActive("settings")
  }, [pathname])

  const navItems = [
    { id: "games", icon: Home, label: "Home", path: "/" },
    { id: "shop", icon: ShoppingCart, label: "Store", path: "/shop" },
    { id: "settings", icon: Settings, label: "Settings", path: "/settings" },
  ] as const

  return (
    <nav
      className={cn(
        "fixed z-50 inset-x-0",
        // Keep off the very bottom edge & respect iOS safe area
        "bottom-[calc(env(safe-area-inset-bottom)+12px)]"
      )}
    >
      <div className="mx-auto w-full max-w-md px-3">
        <div
          className={cn(
            "relative overflow-hidden", // clip inner effects so nothing overflows
            "rounded-2xl border border-black/5 bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)]",
            "px-2 py-1.5" // compact
          )}
        >
          <div className="flex items-stretch">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = active === item.id
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  prefetch
                  onClick={() => setActive(item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    // Equal width, good touch target, clipped inner effects
                    "group relative flex-1 overflow-hidden rounded-xl",
                    "px-2 py-2.5", // smaller overall height
                    "touch-manipulation select-none transition-transform duration-200 active:scale-95"
                  )}
                >
                  {/* Subtle active background, clipped inside the item */}
                  <div
                    className={cn(
                      "pointer-events-none absolute inset-0 rounded-xl",
                      "opacity-0 transition-opacity duration-300",
                      isActive && "opacity-100",
                      "bg-gradient-to-br from-[#667EEA]/15 via-[#4A7FE8]/12 to-[#764BA2]/15"
                    )}
                  />

                  <div className="flex flex-col items-center justify-center gap-1">
                    <Icon
                      className={cn(
                        "h-5 w-5 transition-all duration-300", // smaller icon
                        isActive
                          ? "text-[#4A7FE8] drop-shadow-[0_1px_6px_rgba(74,127,232,0.35)]"
                          : "text-gray-500 group-hover:text-gray-700"
                      )}
                      strokeWidth={isActive ? 2.4 : 2}
                    />
                    <span
                      className={cn(
                        "text-[10px] font-semibold tracking-wide transition-all duration-300", // smaller label
                        isActive ? "text-[#4A7FE8]" : "text-gray-500 group-hover:text-gray-700"
                      )}
                    >
                      {item.label}
                    </span>
                  </div>

                  {/* Tiny active dot, centered and clipped inside */}
                  {isActive && (
                    <span className="pointer-events-none absolute -bottom-0.5 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-[#4A7FE8]/70" />
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
