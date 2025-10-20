"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Play } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useWallet } from "@/hooks/use-wallet"
import { toast } from "sonner"
import { GamePlayer } from "@/components/game-player"
import { GameRating } from "@/components/game-rating"

interface Game {
  id: string
  title: string
  description: string
  thumbnail_url: string
  category: string
  is_active: boolean
}

export function GameCard({ game }: { game: Game }) {
  const [playersOnline, setPlayersOnline] = useState<number>(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const { isConnected, connect, address } = useWallet()

  useEffect(() => {
    // TODO: Fetch real player count from realtime subscription
    setPlayersOnline(Math.floor(Math.random() * 50)) // Mock: 0-50 players
  }, [game.id])

  const handlePlay = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first")
      await connect()
      return
    }

    setIsPlaying(true)
  }

  return (
    <>
      <Card
        className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader className="p-0">
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={game.thumbnail_url || "/placeholder.svg"}
              alt={game.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent opacity-60" />

            {/* Category badge */}
            <Badge className="absolute top-3 right-3 bg-secondary text-secondary-foreground font-bold">
              {game.category}
            </Badge>

            {/* Play button overlay on hover */}
            {isHovered && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center neon-glow">
                  <Play className="w-8 h-8 text-primary-foreground fill-current ml-1" />
                </div>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-3">
          <h3 className="text-xl font-bold text-balance line-clamp-1">{game.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 text-pretty">{game.description}</p>

          <div className="flex items-center justify-between">
            <GameRating gameId={game.id} gameTitle={game.title} />

            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <Users className="w-4 h-4" />
              <span>{playersOnline} playing</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handlePlay}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
            size="lg"
          >
            <Play className="mr-2 h-4 w-4" />
            Play Now
          </Button>
        </CardFooter>
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
