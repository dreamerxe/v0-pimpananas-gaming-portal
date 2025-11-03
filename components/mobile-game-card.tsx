"use client"

import { Card } from "@/components/ui/card"
import { Users, Coins } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useWallet } from "@/hooks/use-wallet"
import { toast } from "sonner"
import { GamePlayer } from "@/components/game-player"

interface Game {
  id: string
  title: string
  description: string
  thumbnail_url: string
  category: string
  average_rating?: number
  total_plays?: number
}

export function MobileGameCard({ game }: { game: Game }) {
  const [playersOnline, setPlayersOnline] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const { isConnected, connect, address } = useWallet()

  useEffect(() => {
    setPlayersOnline(Math.floor(Math.random() * 100000) + 1000)
  }, [game.id])

  const handlePlay = async () => {
    if (!isConnected) {
      toast.error("🍌 Connect your wallet to play!")
      await connect()
      return
    }
    setIsPlaying(true)
  }

  const formatPlayers = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  const showCoinReward = Math.random() > 0.4
  const coinAmount = Math.floor(Math.random() * 15000) + 5000

  return (
    <>
      <Card
        onClick={handlePlay}
        className="overflow-hidden border border-border/30 bg-card/50 backdrop-blur-sm cursor-pointer hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200 active:scale-95"
      >
        {/* Game thumbnail with neon border effect on hover */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={game.thumbnail_url || "/placeholder.svg?height=200&width=200"}
            alt={game.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

          {/* Coin reward badge with neon glow */}
          {showCoinReward && (
            <div className="absolute top-1 right-1 bg-primary text-primary-foreground px-1 py-0.5 rounded-full flex items-center gap-0.5 text-[9px] font-black shadow-lg shadow-primary/30">
              <Coins className="w-2 h-2" />
              {coinAmount}
            </div>
          )}
        </div>

        {/* Game info - compact for mobile */}
        <div className="p-1.5 space-y-0.5">
          <h3 className="font-bold text-[11px] line-clamp-1 text-foreground leading-tight">{game.title}</h3>
          <div className="flex items-center gap-0.5 text-muted-foreground text-[9px]">
            <Users className="w-2 h-2" />
            <span>{formatPlayers(playersOnline)} Players</span>
          </div>
        </div>
      </Card>

      {/* Game Player Modal */}
      {isConnected && address && (
        <GamePlayer
          gameId={game.id}
          gameTitle={game.title}
          walletAddress={address}
          isOpen={isPlaying}
          onClose={() => setIsPlaying(false)}
        />
      )}
    </>
  )
}
