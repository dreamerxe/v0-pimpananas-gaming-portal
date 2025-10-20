"use client"

import { MobileGameCard } from "@/components/mobile-game-card"

interface Game {
  id: string
  title: string
  description: string
  thumbnail_url: string
  category: string
  average_rating: number
  total_plays: number
}

interface GameGridProps {
  games: Game[]
}

export function GameGrid({ games }: GameGridProps) {
  return (
    <div className="grid grid-cols-3 gap-2 px-3">
      {games.map((game) => (
        <MobileGameCard key={game.id} game={game} />
      ))}
    </div>
  )
}
