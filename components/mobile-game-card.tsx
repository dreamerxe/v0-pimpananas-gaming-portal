"use client"

import { Card } from "@/components/ui/card"
import { Users, Coins, Play, Star } from "lucide-react"
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
  const [isPressed, setIsPressed] = useState(false)
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
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  const showCoinReward = Math.random() > 0.3
  const coinAmount = Math.floor(Math.random() * 15000) + 5000

  return (
    <>
      <Card
        onClick={handlePlay}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        className={`
          group overflow-hidden border border-border/30 bg-card/70 backdrop-blur-md cursor-pointer 
          hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/20 
          transition-all duration-300 active:scale-95
          ${isPressed ? 'scale-95 shadow-2xl shadow-primary/30' : ''}
        `}
      >
        {/* Game thumbnail with premium overlay */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted via-muted/50 to-muted">
          <Image
            src={game.thumbnail_url || "/placeholder.svg?height=200&width=200"}
            alt={game.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Gradient overlays for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Play button overlay - appears on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40 backdrop-blur-sm">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl shadow-primary/50 transform group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 text-primary-foreground fill-current ml-0.5" />
            </div>
          </div>

          {/* Coin reward badge */}
          {showCoinReward && (
            <div className="absolute top-2 right-2 bg-gradient-to-r from-primary to-yellow-400 text-primary-foreground px-2 py-1 rounded-full flex items-center gap-1 text-[10px] font-black shadow-lg shadow-primary/30 backdrop-blur-sm border border-primary/20">
              <Coins className="w-2.5 h-2.5" />
              <span>+{coinAmount.toLocaleString()}</span>
            </div>
          )}

          {/* Category badge */}
          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border border-white/10">
            {game.category}
          </div>

          {/* Rating stars */}
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
            <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
            <span className="text-[9px] font-bold text-white">4.{Math.floor(Math.random() * 10)}</span>
          </div>
        </div>

        {/* Game info - sleek and minimal */}
        <div className="p-2 space-y-1.5 bg-gradient-to-b from-card to-card/50">
          <h3 className="font-black text-[12px] line-clamp-1 text-foreground leading-tight tracking-tight">
            {game.title}
          </h3>
          
          {/* Players online */}
          <div className="flex items-center gap-1 text-muted-foreground text-[10px]">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <Users className="w-2.5 h-2.5" />
            <span className="font-medium">{formatPlayers(playersOnline)}</span>
            <span className="font-light">playing</span>
          </div>

          {/* Hover state description */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-0 group-hover:h-auto overflow-hidden">
            <p className="text-[9px] text-muted-foreground/80 font-light line-clamp-2 mt-1">
              {game.description}
            </p>
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