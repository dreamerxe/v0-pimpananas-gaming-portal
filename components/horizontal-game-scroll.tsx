"use client"

import { MobileGameCard } from "@/components/mobile-game-card"

interface Game {
  id: string
  title: string
  description: string
  thumbnail_url: string
  category: string
  is_active: boolean
}

export function HorizontalGameScroll({ games }: { games: Game[] }) {
  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-3 px-4 pb-2">
        {games.map((game) => (
          <MobileGameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  )
}
