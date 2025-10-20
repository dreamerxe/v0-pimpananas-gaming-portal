"use client"

import { Button } from "@/components/ui/button"
import { UserPlus, Users } from "lucide-react"
import { toast } from "sonner"

export function CTAButtons() {
  const handleInvite = () => {
    toast.success("🍌 Invite link copied!")
  }

  const handleDiscover = () => {
    toast.info("🎮 Coming soon!")
  }

  return (
    <div className="w-full px-3 flex gap-2 overflow-hidden">
      <Button
        onClick={handleInvite}
        className="flex-1 min-w-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 px-3 rounded-xl shadow-md shadow-orange-500/20 transition-all duration-200 active:scale-95 active:shadow-lg active:shadow-orange-500/40 text-[11px] sm:text-sm"
      >
        <UserPlus className="mr-1 h-3.5 w-3.5 flex-shrink-0" />
        <span className="truncate">Invite Friends</span>
      </Button>
      <Button
        onClick={handleDiscover}
        className="flex-1 min-w-0 bg-gradient-to-r from-primary to-yellow-400 text-primary-foreground font-bold py-3 px-3 rounded-xl shadow-md shadow-primary/20 transition-all duration-200 active:scale-95 active:shadow-lg active:shadow-primary/40 text-[11px] sm:text-sm"
      >
        <Users className="mr-1 h-3.5 w-3.5 flex-shrink-0" />
        <span className="truncate">Discover People</span>
      </Button>
    </div>
  )
}
