"use client"

import { Gamepad2, MessageCircle, Trophy, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function BottomNav() {
  const [active, setActive] = useState("games")

  const navItems = [
    { id: "games", icon: Gamepad2, label: "Games" },
    { id: "chat", icon: MessageCircle, label: "Chat" },
    { id: "leaderboard", icon: Trophy, label: "Rewards" },
    { id: "profile", icon: User, label: "Profile" },
    { id: "settings", icon: Settings, label: "More" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-primary/20 backdrop-blur-md bg-background/95 shadow-[0_-4px_12px_rgba(0,0,0,0.3)]">
      <div className="flex items-center justify-around px-2 py-2.5">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => setActive(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 h-auto py-2 px-3 transition-all duration-200",
                isActive && "text-primary",
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-all duration-200",
                  isActive && "text-primary drop-shadow-[0_0_8px_rgba(255,226,71,0.6)]",
                )}
              />
              <span className={cn("text-[10px] font-medium", isActive && "font-bold")}>{item.label}</span>
            </Button>
          )
        })}
      </div>
    </nav>
  )
}
